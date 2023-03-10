Move Storage Workflow Operation
===============================

ID: `move-storage`


Description
-----------

The move-storage operation can be used to move files in the asset manager from one storage system to another.


Parameter Table
---------------

|Configuration Key|Example           |Description                                       |
|:----------------|:----------------:|:-------------------------------------------------|
|target-storage\* |local-storage     |The ID of the storage to move the files to        |
|target-version   |0                 |The (optional) snapshot version to move. Use the keyword `latest` to move the last snapshot version.           |

\* mandatory configuration key

Notes:

* Omitting `target-version` will move **all** current versions of the mediapackage to `target-storage`.  An example
  usecase would be moving the raw input media to a cold(er) storage system after initial processing.


Operation Example
-----------------

```xml
<operation
    id="move-storage"
    description="Offloading to AWS S3">
  <configurations>
    <configuration key="target-storage">aws-s3</configuration>
  </configurations>
</operation>
```
