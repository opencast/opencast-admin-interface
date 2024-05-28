Opencast Admin UI
=================

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
By default, this server also replies mock data to the various requests
the UI would normally send to the Opencast backend.

Not all functionality of the admin UI works in this mode. If you need to test
with real data, or need the ability to change it, you can rely on the
proxy functionality of said development server, instead of running the static file server. Run:

```sh
PROXY=1 npm start
```

This assumes you have an Opencast instance running at `http://localhost:8080`
to which the development server will then proxy all the backend request,
authenticating them as user `admin` with password `opencast`.

If you want to work with a different Opencast and/or user, you can change the command thusly:

```sh
PROXY_TARGET=https://develop.opencast.org npm start
```

Here, `PROXY_TARGET` is the target URL of the Opencast instance you want to test against.
This can also be a local one like `http://localhost:8080`.

By default, this tries to authenticate backend requests using HTTP Basic Auth
as user `admin` with the default password `opencast`.
If you want to authenticate using different credentials, you can specify them
in the `PROXY_AUTH` variable in the format `user:password`, as in

```sh
PROXY_TARGET=http://localhost:8080 PROXY_AUTH=jdoe:aligator3 npm start
```

Note that `PROXY=1` is not required if you specify either `PROXY_TARGET` or `PROXY_AUTH`.

Similarly, if you want to change the port the development server itself runs at,
you can specify an alternative port in the `PORT` environment variable.

How to cut a release for Opencast
---------------------------------

1. [NOT YET FUNCTIONAL] (Optional) Run the [Update translations](https://github.com/opencast/opencast-admin-interface/actions/workflows/update-translations.yml/actions/workflows/update-translations.yml) workflow to ensure all changes from crowdin are included in the next release.
1. Switch to the commit you want to turn into the release
1. Create and push a new tag

   ```sh
   DATE=$(date +%Y-%m-%d)
   git tag -m Release -s "$DATE"
   git push upstream "$DATE":"$DATE"
   ```

1. Wait for the [Create release draft](https://github.com/opencast/opencast-admin-interface/actions/workflows/create-release.yml)
   workflow to finish
    - It will create a new [GitHub release draft](https://github.com/opencast/opencast-admin-interface/releases)
    - Review and publish the draft
1. Submit a pull request against Opencast
    - [Update the release](https://github.com/opencast/opencast/blob/b2bea8822b95b8692bb5bbbdf75c9931c2b7298a/modules/admin-ui-interface/pom.xml#L16-L17)
    - [Adjust the documentation](https://github.com/opencast/opencast/blob/b2bea8822b95b8692bb5bbbdf75c9931c2b7298a/docs/guides/admin/docs/modules/admin-ui.md)
      if necessary
    - Verify that the new release runs in Opencast, then create the pull request.

Translating the Admin UI
------------------------

You can help translate the Opencast Admin UI to your language on [crowdin.com/project/opencast-admin-interface](https://crowdin.com/project/opencast-admin-interface). Simply request to join the project on Crowdin and start translating. If you are interested in translating a language that is not a target language right now, please create [a GitHub issue](https://github.com/opencast/opencast-admin-interface/issues) and we will add the language.

This project follows the general form of [Opencast's Localization Process](https://docs.opencast.org/develop/developer/#participate/localization/), especially regarding what happens when you need to [change an existing translation key](https://docs.opencast.org/develop/developer/#participate/localization/#i-need-to-update-the-wording-of-the-source-translation-what-happens).  Any questions not answered there should be referred to the mailing lists!

Configuration
-------------

The Admin UI frontend cannot be directly configured. Rather, it adapts to the
various configurations in the Opencast backend. TODO: Throw in some links to the
docs, which ones?
