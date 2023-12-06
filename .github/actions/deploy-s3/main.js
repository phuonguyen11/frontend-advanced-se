const core = require("@actions/core");
const exec = require("@actions/exec");

function run() {
  // 1) get some input values
  // bucket, bucket-region, bucket-folder
  const bucket = core.getInput("bucket", { required: true });
  const bucketRegion = core.getInput("bucket-region", { required: true }); // have default value
  const distFolder = core.getInput("dist-folder", { required: true });
  // 2) Upload files
  const s3Uri = `s3://${bucket}`;
  exec.exec(`aws s3 sync ${distFolder} ${s3Uri} --region ${bucketRegion}`);

  // core.notice('Hello from my custom js action!') // log to github actions workflow
  const websiteUrl = `http://${bucket}.s3-website-${bucketRegion}.amazonaws.com`;
  core.setOutput("website-url", websiteUrl);
}

run();
