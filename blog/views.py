import json
import logging

from django.shortcuts import redirect
from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from mysite.GoogleAPI import AuthFirebase
from .forms import PostForm
from .models import Post
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

logger = logging.getLogger(__name__)


def post_list(request):
    posts = Post.objects.filter(published_date__lte=timezone.now()).order_by('published_date')
    return render(request, 'blog/post_list.html', {'posts':posts})

def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    return render(request, 'blog/post_detail.html', {'post': post})

def post_new(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.published_date = timezone.now()
            post.save()
            return redirect('post_detail', pk=post.pk)
    else:
        form = PostForm()
    return render(request, 'blog/post_edit.html', {'form':form})


def post_edit(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if request.method == "POST":
        form = PostForm(request.POST, instance=post)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.published_date = timezone.now()
            post.save()
            return redirect('post_detail', pk=post.pk)
    else:
        form = PostForm(instance=post)
    return render(request, 'blog/post_edit.html', {'form':form})


def login(request):
    return render(request, 'blog/login.html')


@api_view(['POST'])
def google_auth(request):
    params = json.loads(request.body)
    token = params.get('token', "")
    print(token)
    AuthFirebase(token)
    return Response(status=status.HTTP_200_OK)

