from firebase_admin import auth


def AuthFirebase(userToken):
    decoded_token = auth.verify_id_token(userToken)
    uid = decoded_token['uid']
    return uid
