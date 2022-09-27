# Demo Basic Authentication Express Server

This simply demonstrates Basic HTTP Authetication with Express server and middleware.

You can try it here:

To create new user, POST to `/signup` with a body of

    {
        "username": "myuser",
        "password": "pass"
    }

Then you can POST to `/signin` with Basic Authorization headers.

There is a live server at `https://demo-basic-auth-express-server.onrender.com/`
