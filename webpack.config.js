const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // const fs = require("fs");
  // const path = require("path");
  // const webpack = require("webpack");

  // const appDirectory = fs.realpathSync(process.cwd());
  // const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

  // const PACKAGES = [MY - PACKAGES];
  // const NODE_MODULES_WHITELIST = [
  //   MY - NODE_MODULES - THAT - NEED - TRANSFORMATION,
  // ];

  // const appIncludes = [
  //   resolveApp("src"),
  //   ...PACKAGES.map((p) => resolveApp(`../${p}/src`)),
  //   ...NODE_MODULES_WHITELIST.map((m) => resolveApp(`../../node_modules/${m}`)),
  // ];

  module.exports = function override(config, env) {
    config.module.strictExportPresence = false;

    // resolve config alias
    delete config.resolve.alias["react-native"];

    // CRA actually has a problem with libraries. You need to include libraries
    // that finish with react-native (react-native-device-info is wrong for instance)
    config.resolve.alias["react-native$"] = "react-native-web";

    // allow importing from outside of src folder
    config.resolve.plugins = config.resolve.plugins.filter(
      (plugin) => plugin.constructor.name !== "ModuleScopePlugin"
    );
    config.module.rules[0].include = appIncludes;
    config.module.rules[1] = null;
    config.module.rules[2].oneOf[1].include = appIncludes;
    config.module.rules[2].oneOf[1].options.presets = [
      "module:react-native-dotenv",
      require.resolve("@babel/preset-react"),
    ].concat(config.module.rules[2].oneOf[1].options.presets);
    config.module.rules[2].oneOf[1].options.plugins = [
      require.resolve("babel-plugin-transform-react-remove-prop-types"),
      require.resolve("@babel/plugin-transform-flow-strip-types"),
      require.resolve("@babel/plugin-proposal-class-properties"),
      require.resolve("babel-plugin-react-native-web"),
      [
        "module-resolver",
        {
          root: ["./src"],
          resolvePath(sourcePath, currentFile, ...otherparams /* opts */) {
            // Need to check if the source path is ../../Platform and if the currentFile belongs to the react native module to prevent conflicts
            // Then you can resolve (return as a string) to the path that you want.
            return resolvePath(sourcePath, currentFile, otherparams);
          },
          loglevel: "verbose",
        },
      ],
    ].concat(config.module.rules[2].oneOf[1].options.plugins);
    config.module.rules = config.module.rules.filter(Boolean);

    config.plugins.push(
      new webpack.DefinePlugin({ __DEV__: env !== "production" }),
      // Some old stuff is not compatible with new versions of RNWeb
      new webpack.NormalModuleReplacementPlugin(
        new RegExp(
          "node_modules/react-native-vector-icons/lib/toolbar-android.js"
        ),
        path.resolve("./config/toolbar.android.js")
      )
    );
  };
  // Customize the config before returning it.
  return config;
};
