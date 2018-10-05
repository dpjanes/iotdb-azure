/*
 *  s3/upload_document.js
 *
 *  David Janes
 *  IOTDB.org
 *  2018-10-05
 *
 *  Copyright [2013-2018] [David P. Janes]
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict"

const _ = require("iotdb-helpers")

const assert = require("assert")

const azure = require("azure-storage")

/**
 *  Requires: self.azure
 *  Produces: 
 */
const upload_document = _.promise.make((self, done) => {
    const method = "s3.upload_document";

    assert.ok(self.azure, `${method}: expected self.azure`)
    assert.ok(self.azure.accountName, `${method}: expected self.azure.accountName`)
    assert.ok(self.azure.accountKey, `${method}: expected self.azure.accountKey`)
    assert.ok(self.bucket, `${method}: expected self.bucket`)

    const service = azure.createBlobService(self.azure.accountName, self.azure.accountKey)

    service.createContainerIfNotExists(self.bucket, {
        publicAccessLevel: "blob",
    }, (error, result, response) => {
        if (error) {
            console.log("#", _.error.message(error))
            done(error)
        }

        self.bucket_url = `https://${self.azure.accountName}.blob.core.windows.net/${result.name}`
        self.blob_result = result

        done(null, self)
    });
})

/**
 *  API
 */
exports.upload_document = upload_document
