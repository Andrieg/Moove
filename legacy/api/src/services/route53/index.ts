import AWS from 'aws-sdk';

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

const route53 = new AWS.Route53({
  region: 'us-east-1',
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
});

const getZoneID = async () => {
  const res = await route53.listHostedZones().promise();
  return res?.HostedZones[0]?.Id;
};

const listZoneRecords = async (zoneID: string) => {
  const res = await route53.listResourceRecordSets({
    HostedZoneId: zoneID,
  }).promise();

  return res?.ResourceRecordSets;
}

const createRecord = async (brand: string) => {
  const zoneID = await getZoneID();

  if (zoneID) {
    const records = await listZoneRecords(zoneID);
    const exists = !!records?.length && records.find(record => record.Name === `${brand}.moove.fit.`);

    if (!exists) {
      const res = await route53.changeResourceRecordSets({
        HostedZoneId: zoneID,
        ChangeBatch: {
          Changes: [{
            Action: 'CREATE',
            ResourceRecordSet: {
              Name: `${brand}.moove.fit`,
              Type: 'CNAME',
              TTL: 60 * 5, // 5 minutes
              ResourceRecords: [{ Value: 'lp.moove.fit' }]
            }
          }]
        }
      }).promise();
      console.log(res);
    } else {
      console.log('exists', exists)
    }
  }
}

const deleteRecord = async (brand: string) => {
  const zoneID = await getZoneID();

  if (zoneID) {
    const records = await listZoneRecords(zoneID);
    const exists = !!records?.length && records.find(record => record.Name === `${brand}.moove.fit.`);

    if (!!exists) {
      const res = await route53.changeResourceRecordSets({
        HostedZoneId: zoneID,
        ChangeBatch: {
          Changes: [{ 
            Action: 'DELETE',
            ResourceRecordSet: {
              Name: `${brand}.moove.fit`,
              Type: 'CNAME',
              TTL: 60 * 5, // 5 minutes
              ResourceRecords: [{ Value: 'lp.moove.fit' }]
            }
          }]
        }
      }).promise();
      console.log(res);
    }
  }
}


export {
  getZoneID,
  createRecord,
  deleteRecord,
};