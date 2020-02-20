const qiniu = require('qiniu');

export function createQiniuToken() {
    var accessKey = 'hwKeDbtDBYYCWO0BhATe5kvs5gX8lngoDL7NY-4Y';
    var secretKey = 'wCa8lSCDRDlRlFoBC4gXh6Ib90BXw7NXIASL5Oui';
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);


    var options = {
        scope: 'qy-camera',
    }

    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(mac);
    return uploadToken;
}
