require('./check-versions')();

process.env.NODE_ENV = 'production';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const { spawn } = require('child_process');
const webpackConfig = require('./webpack.prod.conf');

const isExampleEnv = process.env.EXAMPLE_ENV;

webpack(webpackConfig, (err, stats) => {
  if (err) throw err;

  process.stdout.write(
    stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    }) + '\n\n',
  );

  if (stats.hasErrors()) {
    console.log(chalk.red('Build failed with errors.\n'));
    process.exit(1);
  }

  console.log(chalk.cyan('Build sources complete.\n'));

  if (isExampleEnv) {
    console.log(
      chalk.yellow(
        'Tip: built files are meant to be served over an HTTP server.\n' +
          "Opening index.html over file:// won't work.\n",
      ),
    );
  } else {
    const buildEsmProcess = spawn('npm', ['run', 'build:esm'], {
      stdio: 'inherit',
    });

    buildEsmProcess.on('close', () => {
      console.log(chalk.cyan('Build esm complete.\n'));
    });

    const buildTypesProcess = spawn('npm', ['run', 'build:dts'], {
      stdio: 'inherit',
    });

    buildTypesProcess.on('close', () => {
      console.log(chalk.cyan('Build types(.d.ts) complete.\n'));
    });
  }
});
