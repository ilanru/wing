const $stdlib = require('@winglang/sdk');
const $outdir = process.env.WING_SYNTH_DIR ?? ".";
const $wing_is_test = process.env.WING_IS_TEST === "true";
const $AppBase = $stdlib.core.App.for(process.env.WING_TARGET);
class $Root extends $stdlib.core.Resource {
  constructor(scope, id) {
    super(scope, id);
    const x = new $stdlib.core.Inflight(this, "$Inflight1", {
      code: $stdlib.core.NodeJsCode.fromFile(require.resolve("./proc.e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855/index.js".replace(/\\/g, "/"))),
      bindings: {
      }
    })
    ;
    const y = new $stdlib.core.Inflight(this, "$Inflight2", {
      code: $stdlib.core.NodeJsCode.fromFile(require.resolve("./proc.e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855/index.js".replace(/\\/g, "/"))),
      bindings: {
      }
    })
    ;
  }
}
class $App extends $AppBase {
  constructor() {
    super({ outdir: $outdir, name: "identical_inflights", plugins: $plugins, isTestEnvironment: $wing_is_test });
    if ($wing_is_test) {
      new $Root(this, "env0");
      const $test_runner = this.testRunner;
      const $tests = $test_runner.findTests();
      for (let $i = 1; $i < $tests.length; $i++) {
        new $Root(this, "env" + $i);
      }
    } else {
      new $Root(this, "Default");
    }
  }
}
new $App().synth();