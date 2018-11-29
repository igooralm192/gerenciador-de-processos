module.exports = {
    entry: './src/index.js',
    output: {
      path: __dirname + '/public',
      publicPath: '/',
      filename: 'bundle.js'
    },
    devServer: {
      contentBase: './public'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },

            {
                test: /\.css$/,
                loader: ["style-loader", "css-loader"]
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
};