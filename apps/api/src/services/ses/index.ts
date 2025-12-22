import AWS from "aws-sdk";
import TokenEmail from './emails/loginToken.json';

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = process.env;

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION
});

const ses = new AWS.SES({
  apiVersion: "2010-12-01"
});

const uploadTemplates = async () => ses.createTemplate(TokenEmail, err => {
  if (err && err.code !== "AlreadyExists") console.error(err, err.stack);
  if (err) console.error(err, err.stack)
});

const sendEmail = (email, template, data) => {
  const params = {
    Source: "hello@moove.fit",
    Template: template,
    ConfigurationSetName: "Moovefit",
    Destination: {
      ToAddresses: [email]
    },
    TemplateData: JSON.stringify(data)
  };

  ses.sendTemplatedEmail(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log(data);
  });
};

const deleteTemplates = async() => ses.deleteTemplate(
  { TemplateName: "TokenEmail" },
  err => err && console.log("[DELETE TEMPS ERROR]:", err)
).promise();

const resetTemplates = async () => {
  await deleteTemplates();
  uploadTemplates();
}

export {
  uploadTemplates,
  sendEmail,
  deleteTemplates,
  resetTemplates
}