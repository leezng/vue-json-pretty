require('./check-versions')();

process.env.NODE_ENV = 'production';

const chalk = require('chalk');
const webpack = require('webpack');
const webpackConfig = require('./webpack.prod.conf');

const isEsm = process.env.ESM;
const isExampleEnv = process.env.EXAMPLE_ENV;

const successText = {
  main: 'Build main sources complete.',
  esm: 'Build esm sources complete.',
  example: 'Build example page complete.',
};

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

  const text = isExampleEnv ? successText.example : isEsm ? successText.esm : successText.main;
  console.log(chalk.cyan(`${text}\n`));

  if (isExampleEnv) {
    console.log(
      chalk.yellow(
        'Tip: built files are meant to be served over an HTTP server.\n' +
          "Opening index.html over file:// won't work.\n",
      ),
    );
  }
});
