"use strict";

const helper = require("../fixtures/helper");
const expect = require("chai").expect;
const fs = require("fs");
const isWindows = process.platform === "win32";

describe("swagger-cli bundle", () => {

  function readFile (path) {
    let contents = fs.readFileSync(path, "utf8");
    if (isWindows) {
      return contents.replace(/\r\n/g, "\n");
    }
    else {
      return contents;
    }
  }

  it("should bundle a single-file API", () => {
    let output = helper.run("bundle", "test/files/valid/single-file/api.yaml");
    let expectedOutput = readFile("test/files/valid/single-file/api.bundled.json");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal(expectedOutput + "\n");
  });

  it("should bundle a multi-file API", () => {
    let output = helper.run("bundle", "test/files/valid/multi-file/api.yaml");
    let expectedOutput = readFile("test/files/valid/multi-file/api.bundled.json");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal(expectedOutput + "\n");
  });

  it("should bundle an API with circular references", () => {
    let output = helper.run("bundle", "test/files/valid/circular-refs/api.yaml");
    let expectedOutput = readFile("test/files/valid/circular-refs/api.bundled.json");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal(expectedOutput + "\n");
  });

  it("should bundle a single-file API as YAML", () => {
    let output = helper.run("bundle", "-t", "yaml", "test/files/valid/single-file/api.yaml");
    let expectedOutput = readFile("test/files/valid/single-file/api.bundled.yaml");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal(expectedOutput + "\n");
  });

  it("should bundle a multi-file API as YAML", () => {
    let output = helper.run("bundle", "-t", "yaml", "test/files/valid/multi-file/api.yaml");
    let expectedOutput = readFile("test/files/valid/multi-file/api.bundled.yaml");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal(expectedOutput + "\n");
  });

  it("should bundle an API with circular references as YAML", () => {
    let output = helper.run("bundle", "-t", "yaml", "test/files/valid/circular-refs/api.yaml");
    let expectedOutput = readFile("test/files/valid/circular-refs/api.bundled.yaml");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal(expectedOutput + "\n");
  });

  it("should dereference a single-file API (--dereference)", () => {
    let output = helper.run("bundle", "--dereference", "test/files/valid/single-file/api.yaml");
    let expectedOutput = readFile("test/files/valid/single-file/api.dereferenced.json");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal(expectedOutput + "\n");
  });

  it("should dereference a multi-file API (-r)", () => {
    let output = helper.run("bundle", "-r", "test/files/valid/multi-file/api.yaml");
    let expectedOutput = readFile("test/files/valid/multi-file/api.dereferenced.json");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal(expectedOutput + "\n");
  });

  /*  it("should fail to dereference an API with circular references", () => {
    let output = helper.run("bundle", "-r", "test/files/valid/circular-refs/api.yaml");

    expect(output.stdout).to.have.lengthOf(0);
    expect(output.status).to.equal(1);
    expect(output.stderr).to.contain("Circular $ref pointer found at ");
    expect(output.stderr).to.contain("test/files/valid/circular-refs/api.yaml#/paths/~1thing/get/responses/200/schema\n");
  });

  it("should dereference a single-file API (--dereference) as YAML", () => {
    let output = helper.run("bundle", "-t", "yaml", "--dereference", "test/files/valid/single-file/api.yaml");
    let expectedOutput = readFile("test/files/valid/single-file/api.dereferenced.yaml");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal(expectedOutput + "\n");
  });*/

  it("should dereference a multi-file API (-r) as YAML", () => {
    let output = helper.run("bundle", "-t", "yaml", "-r", "test/files/valid/multi-file/api.yaml");
    let expectedOutput = readFile("test/files/valid/multi-file/api.dereferenced.yaml");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal(expectedOutput + "\n");
  });

  /*  it("should fail to dereference an API with circular references as YAML", () => {
    let output = helper.run("bundle", "-t", "yaml", "-r", "test/files/valid/circular-refs/api.yaml");

    expect(output.stdout).to.have.lengthOf(0);
    expect(output.status).to.equal(1);
    expect(output.stderr).to.contain("Circular $ref pointer found at ");
    expect(output.stderr).to.contain("test/files/valid/circular-refs/api.yaml#/paths/~1thing/get/responses/200/schema\n");
  });*/

  it("should output to a file (--outfile <file>)", () => {
    let output = helper.run("bundle", "--outfile", "test/.tmp/bundled.json", "test/files/valid/single-file/api.yaml");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.be.match(/Created test[/\\].tmp[/\\]bundled.json from test[/\\]files[/\\]valid[/\\]single-file[/\\]api.yaml\n/);

    let expectedOutput = readFile("test/files/valid/single-file/api.bundled.json");
    let actualOutput = readFile("test/.tmp/bundled.json");
    expect(actualOutput).to.equal(expectedOutput);
  });

  it("should output to a file (--outfile=<file>)", () => {
    let output = helper.run("bundle", "--outfile=test/.tmp/bundled.json", "test/files/valid/multi-file/api.yaml");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.be.match(/Created test[/\\].tmp[/\\]bundled.json from test[/\\]files[/\\]valid[/\\]multi-file[/\\]api.yaml\n/);

    let expectedOutput = readFile("test/files/valid/multi-file/api.bundled.json");
    let actualOutput = readFile("test/.tmp/bundled.json");
    expect(actualOutput).to.equal(expectedOutput);
  });

  it("should output to a file (-o <file>)", () => {
    let output = helper.run("bundle", "-o", "test/.tmp/bundled.json", "test/files/valid/circular-refs/api.yaml");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.be.match(/Created test[/\\].tmp[/\\]bundled.json from test[/\\]files[/\\]valid[/\\]circular-refs[/\\]api.yaml\n/);

    let expectedOutput = readFile("test/files/valid/circular-refs/api.bundled.json");
    let actualOutput = readFile("test/.tmp/bundled.json");
    expect(actualOutput).to.equal(expectedOutput);
  });

  it("should output to a file (--outfile <file>) as YAML", () => {
    let output = helper.run("bundle", "-t", "yaml", "--outfile", "test/.tmp/bundled.yaml", "test/files/valid/single-file/api.yaml");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.be.match(/Created test[/\\].tmp[/\\]bundled.yaml from test[/\\]files[/\\]valid[/\\]single-file[/\\]api.yaml\n/);

    let expectedOutput = readFile("test/files/valid/single-file/api.bundled.yaml");
    let actualOutput = readFile("test/.tmp/bundled.yaml");
    expect(actualOutput).to.equal(expectedOutput);
  });

  it("should output to a file (--outfile=<file>) as YAML", () => {
    let output = helper.run("bundle", "-t", "yaml", "--outfile=test/.tmp/bundled.yaml", "test/files/valid/multi-file/api.yaml");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.be.match(/Created test[/\\].tmp[/\\]bundled.yaml from test[/\\]files[/\\]valid[/\\]multi-file[/\\]api.yaml\n/);

    let expectedOutput = readFile("test/files/valid/multi-file/api.bundled.yaml");
    let actualOutput = readFile("test/.tmp/bundled.yaml");
    expect(actualOutput).to.equal(expectedOutput);
  });

  it("should output to a file (-o <file>) as YAML", () => {
    let output = helper.run("bundle", "-t", "yaml", "-o", "test/.tmp/bundled.yaml", "test/files/valid/circular-refs/api.yaml");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.be.match(/Created test[/\\].tmp[/\\]bundled.yaml from test[/\\]files[/\\]valid[/\\]circular-refs[/\\]api.yaml\n/);

    let expectedOutput = readFile("test/files/valid/circular-refs/api.bundled.yaml");
    let actualOutput = readFile("test/.tmp/bundled.yaml");
    expect(actualOutput).to.equal(expectedOutput);
  });

  it("should use 4-space indent instead of 2-spaces (--format 4)", () => {
    let output = helper.run("bundle", "--format", "4", "test/files/valid/single-file/api.yaml");
    let expectedOutput = readFile("test/files/valid/single-file/api.bundled.4-spaces.json");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.be.equal(expectedOutput + "\n");
  });

  it("should use 4-space indent instead of 2-spaces (--format=4)", () => {
    let output = helper.run("bundle", "--format=4", "test/files/valid/single-file/api.yaml");
    let expectedOutput = readFile("test/files/valid/single-file/api.bundled.4-spaces.json");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.be.equal(expectedOutput + "\n");
  });

  it("should use 4-space indent instead of 2-spaces (-f 4)", () => {
    let output = helper.run("bundle", "-f", "4", "test/files/valid/single-file/api.yaml");
    let expectedOutput = readFile("test/files/valid/single-file/api.bundled.4-spaces.json");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.be.equal(expectedOutput + "\n");
  });

  it("should use 4-space indent instead of 2-spaces (--format 4) as YAML", () => {
    let output = helper.run("bundle", "-t", "yaml", "--format", "4", "test/files/valid/single-file/api.yaml");
    let expectedOutput = readFile("test/files/valid/single-file/api.bundled.4-spaces.yaml");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.be.equal(expectedOutput + "\n");
  });

  it("should use 4-space indent instead of 2-spaces (--format=4) as YAML", () => {
    let output = helper.run("bundle", "-t", "yaml", "--format=4", "test/files/valid/single-file/api.yaml");
    let expectedOutput = readFile("test/files/valid/single-file/api.bundled.4-spaces.yaml");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.be.equal(expectedOutput + "\n");
  });

  it("should use 4-space indent instead of 2-spaces (-f 4) as YAML", () => {
    let output = helper.run("bundle", "-t", "yaml", "-f", "4", "test/files/valid/single-file/api.yaml");
    let expectedOutput = readFile("test/files/valid/single-file/api.bundled.4-spaces.yaml");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.be.equal(expectedOutput + "\n");
  });

  it("should use wrap YAML output at 80 characters (--wrap 80)", () => {
    let output = helper.run("bundle", "-t", "yaml", "--wrap", "80", "test/files/valid/single-file/api.yaml");
    let expectedOutput = readFile("test/files/valid/single-file/api.bundled.wrap-80.yaml");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.be.equal(expectedOutput + "\n");
  });

  it("should use all three options together (-rf=4 -o=<file>)", () => {
    let output = helper.run("bundle", "-rf=4", "-o=test/.tmp/dereferenced.json", "test/files/valid/single-file/api.yaml");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.be.match(/Created test[/\\].tmp[/\\]dereferenced.json from test[/\\]files[/\\]valid[/\\]single-file[/\\]api.yaml\n/);

    let expectedOutput = readFile("test/files/valid/single-file/api.dereferenced.4-spaces.json");
    let actualOutput = readFile("test/.tmp/dereferenced.json");
    expect(actualOutput).to.equal(expectedOutput);
  });

  it("should use all three options together (-rf=4 -o=<file>) as YAML", () => {
    let output = helper.run("bundle", "-t", "yaml", "-rf=4", "-o=test/.tmp/dereferenced.yaml", "test/files/valid/single-file/api.yaml");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.be.match(/Created test[/\\].tmp[/\\]dereferenced.yaml from test[/\\]files[/\\]valid[/\\]single-file[/\\]api.yaml\n/);

    let expectedOutput = readFile("test/files/valid/single-file/api.dereferenced.4-spaces.yaml");
    let actualOutput = readFile("test/.tmp/dereferenced.yaml");
    expect(actualOutput).to.equal(expectedOutput);
  });

  it("should use all three options together (-rf=4 -o=<file>) as YAML (--type yaml)", () => {
    let output = helper.run("bundle", "--type", "yaml", "-rf=4", "-o=test/.tmp/dereferenced.yaml", "test/files/valid/single-file/api.yaml");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.be.match(/Created test[/\\].tmp[/\\]dereferenced.yaml from test[/\\]files[/\\]valid[/\\]single-file[/\\]api.yaml\n/);

    let expectedOutput = readFile("test/files/valid/single-file/api.dereferenced.4-spaces.yaml");
    let actualOutput = readFile("test/.tmp/dereferenced.yaml");
    expect(actualOutput).to.equal(expectedOutput);
  });

  it("should fail if a $ref is invalid", () => {
    let output = helper.run("bundle", "test/files/invalid/internal-ref/api.yaml");

    expect(output.stdout).to.have.lengthOf(0);
    expect(output.status).to.equal(1);
    expect(output.stderr).to.include('Token "definitions" does not exist.\n');
  });

  it("should fail if a referenced file does not exist", () => {
    let output = helper.run("bundle", "test/files/invalid/external-ref/api.yaml");

    expect(output.stdout).to.have.lengthOf(0);
    expect(output.status).to.equal(1);
    expect(output.stderr).to.include("Error opening file ");
    expect(output.stderr).to.include("ENOENT: no such file or directory");
  });

  it("should output the full error stack in debug mode", () => {
    let output = helper.run("--debug", "bundle", "test/files/invalid/external-ref/api.yaml");

    expect(output.stdout).not.to.have.lengthOf(0);
    expect(output.status).to.equal(1);
    expect(output.stderr).to.contain("Error opening file ");
    expect(output.stderr).to.include("ENOENT: no such file or directory");
    expect(output.stderr).to.include("at ReadFileContext");
  });

});
