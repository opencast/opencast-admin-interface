Opencast Admin UI
=====================

The Opencast Admin UI is a graphical interface included by Opencast to give
admins an easy way of managing their Opencast instance.


Quickstart
----------
Commands to hack into your console to get to testing pull requests ASAP:

```console
git clone git@github.com:opencast/opencast-admin-interface.git opencast-admin-interface-demo
cd opencast-admin-interface-demo
npm ci
cd app
npm ci
cd ..
npm run proxy-server http://stable.opencast.org opencast_system_account CHANGE_ME
```

Open a second tab:

```
npm run client
```

Open a third tab to checkout the pull request you want to test. You need to know the pull request number!:

```
git fetch origin pull/{PULL REQUEST NUMBER HERE}/head:some-branch-name-of-your-choosing
git checkout some-branch-name-of-your-choosing
```

Development
-------

Before starting, get the project dependencies by running  `npm ci` beforehand both in the root and `/app` directory.

To test with real data run:

    npm run proxy-server http://stable.opencast.org *opencast_digest_username* *opencast_digest_password*

This will start a proxy server at localhost:5000. It will automatically proxy
requests to a Opencast instance at http://stable.opencast.org. You can change
the url to at a different Opencast if you wish (e.g. http://localhost.8080 for
a local Opencast installation). Note that `http` is required.

You can then start the client in a different tab by running:

    npm run client

This will start a client server in the development mode.
Open [http://localhost:3000](localhost:3000) to view it in the browser.

--------

Alternatively you can spin up a mock instance of the admin ui with:

    npm start

This uses mock data instead of a real Opencast. This means certain features will
not work when using this mode.

### Alternative ports

The static file server and the proxy server serve their content
on the port 5000. If this is used already (as it is on macOS)
you can specify an alternative port in the `PORT` environment variable,
for example:

    PORT=5001 npm run proxy-server ...

Note that you need to specify the same port when running the client,
this time in the `PROXY_PORT` variable:

    PROXY_PORT=5001 npm run client

How to cut a release for Opencast
---------------------------------

1. [NOT YET FUNCTIONAL] (Optional) Run the [Update translations](https://github.com/opencast/opencast-editor/actions/workflows/update-translations.yml) workflow, to make sure all changes from crowdin are included in the next release.
1. Switch to the commit you want to turn into the release
1. Create and push a new tag
   ```bash
    DATE=$(date +%Y-%m-%d)
    git tag -m Release -s "$DATE"
    git push upstream "$DATE":"$DATE"
   ```
1. Wait for the [Create release draft](https://github.com/opencast/opencast-editor/actions/workflows/create-release.yml)
   workflow to finish
    - It will create a new [GitHub release draft](https://github.com/opencast/opencast-editor/releases)
    - Review and publish the draft
1. Submit a pull request against Opencast
    - [Update the release](https://github.com/opencast/opencast/blob/b2bea8822b95b8692bb5bbbdf75c9931c2b7298a/modules/admin-ui-interface/pom.xml#L16-L17)
    - [Adjust the documentation](https://github.com/opencast/opencast/blob/b2bea8822b95b8692bb5bbbdf75c9931c2b7298a/docs/guides/admin/docs/modules/admin-ui.md)
      if necessary
    - Verify that the new release runs in Opencast, then create the pull request.



Opencast API used by the Admin UI
-------------
The Admin UI accesses all endpoints in Opencast located under

* `/admin-ng/*`

If you want to use current version of the frontend with an earlier Opencast
version, you will have to cherry pick the relevant commits from the Opencast
repository yourself.



Translating the Admin UI
-------------
You can help translating the editor to your language on [crowdin.com/project/opencast-admin-interface](https://crowdin.com/project/opencast-admin-interface). Simply request to join the project on Crowdin and start translating. If you are interested in translating a language which is not a target language right now, please create [a GitHub issue](https://github.com/opencast/opencast-admin-interface/issues) and we will add the language.

This project follows the general form of [Opencast's Localization Process](https://docs.opencast.org/develop/developer/#participate/localization/), especially regarding what happens when you need to [change an existing translation key](https://docs.opencast.org/develop/developer/#participate/localization/#i-need-to-update-the-wording-of-the-source-translation-what-happens).  Any questions not answered there should be referred to the mailing lists!



Configuration
-------------
The Admin UI frontend cannot be directly configured. Rather, it adapts to the
various configurations in the Opencast backend. TODO: Throw in some links to the
docs, which ones?
