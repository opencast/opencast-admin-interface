Opencast Admin UI
=================
asdf
The Opencast Admin UI is a graphical interface included with Opencast
that allows admins to easily manage their Opencast instance.

Development and testing
-----------------------

To get a local copy of the admin UI to test or develop on, you can do the following:

```sh
git clone git@github.com:opencast/opencast-admin-interface.git opencast-admin-interface-demo
cd opencast-admin-interface-demo
git switch my-branch  # or otherwise check out, pull, merge, etc. whatever branch you want to test/hack on
npm ci
```

You can now run a local instance of the UI by saying

```sh
npm start
```

This runs a development server at `http://localhost:3000`, serving a development build
of the admin UI, and automatically opens a browser tab pointed to it.
The build and the browser tab should automatically refresh on every change you make
to the codebase.

The default target for API calls is `https://develop.opencast.org` to which the development server will proxy all the backend request,
authenticating them as user `admin` with password `opencast`.

If you want to work with a different Opencast and/or user, you can change the command thusly:

```sh
PROXY_TARGET=http://localhost:8080 npm start
```

Here, `PROXY_TARGET` is the target URL of the Opencast instance you want to test against.

By default, this tries to authenticate backend requests using HTTP Basic Auth
as user `admin` with the default password `opencast`.
If you want to authenticate using different credentials, you can specify them
in the `PROXY_AUTH` variable in the format `user:password`, as in

```sh
PROXY_TARGET=http://localhost:8080 PROXY_AUTH=jdoe:aligator3 npm start
```

Similarly, if you want to change the port the development server itself runs at,
you can specify an alternative port in the `PORT` environment variable.

If you aim to test against a remote server without using a proxy, you have the option to configure the target server with the `VITE_TEST_SERVER_URL`, and the `VITE_TEST_SERVER_AUTH` environment variables while using the node development mode:

```sh
NODE_ENV=development VITE_TEST_SERVER_URL="https://develop.opencast.org" VITE_TEST_SERVER_AUTH="admin:opencast" npm start
```

How to cut a release for Opencast
---------------------------------

1. (Optional) Run the GitHub Actions workflow [Crowdin » Download translations
   ](https://github.com/opencast/opencast-admin-interface/actions/workflows/crowdin-download-translations.yml)
   to ensure all changes from Crowdin are included in the new release.

2. Switch to the commit you want to turn into the release

3. Create and push a new tag
   ```sh
   DATE=$(date +%Y-%m-%d)
   git tag -s -m "Release ${DATE}" "${DATE}"
   git push upstream "${DATE}"
   ```

4. Wait for the [Create release draft](https://github.com/opencast/opencast-admin-interface/actions/workflows/create-release.yml)
   workflow to finish
    - It will create a new [GitHub release draft](https://github.com/opencast/opencast-admin-interface/releases)
    - Review and publish the draft
        - By selecting the previous release, Github can generate release notes automatically 

5. Submit a pull request against Opencast
    - [Update the release](https://github.com/opencast/opencast/blob/542fc1f82181d1d4712ac8fc06c5ea9e16ae4033/modules/admin-ui-interface/pom.xml#L16-L17)
    - Verify that the new release runs in Opencast, then create the pull request.


Translating the Admin Interface
-------------------------------

You can help translate the Opencast Admin UI to your language on [crowdin.com/project/opencast-admin-interface](https://crowdin.com/project/opencast-admin-interface). Simply request to join the project on Crowdin and start translating. If you are interested in translating a language that is not a target language right now, please create [a GitHub issue](https://github.com/opencast/opencast-admin-interface/issues) and we will add the language.

This project follows the general form of [Opencast's Localization Process](https://docs.opencast.org/develop/developer/#participate/localization/), especially regarding what happens when you need to [change an existing translation key](https://docs.opencast.org/develop/developer/#participate/localization/#i-need-to-update-the-wording-of-the-source-translation-what-happens).  Any questions not answered there should be referred to the mailing lists!


Configuration
-------------

The Admin UI frontend cannot be directly configured. Rather, it adapts to the
various configurations in the Opencast backend. Fore more information, take a look
at [Opencast's documentation](https://docs.opencast.org).
