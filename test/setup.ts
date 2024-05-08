import { rm } from "fs";
import { join } from "path";

//execute before each test files
global.beforeEach(async () => {
  try {
    await rm(join(__dirname, "..", "test.sqlite"),
      () => console.log("test.db removed")
    );

  } catch (e) {
  }
});