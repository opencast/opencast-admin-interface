Opencast Admin UI
=====================

The Opencast Admin UI is a graphical interface included by Opencast to give
admins an easy way of managing their Opencast instance.



Development
-------
To test locally, run:

    npm start

(You may have to run `npm ci` beforehand both in the root and `/app` directory)

This will start a client server in the development mode.
Open [http://localhost:3000](localhost:3000) to view it in the browser.
It will also start a backend server with dummy data at localhost:5000.

--------

To test with real data, instead run:

    npm proxy-server *opencast_digest_username* *opencast_digest_password*

This will start a proxy server at localhost:5000. It will automatically proxy
requests to a Opencast instance at localhost:8080.
You can then start the client in a different tab by running:

    npm run client



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
TBA



Configuration
-------------
The Admin UI frontend cannot be directly configured. Rather, it adapts to the
various configurations in the Opencast backend. TODO: Throw in some links to the
docs, which ones?