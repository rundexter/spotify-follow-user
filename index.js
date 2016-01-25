var _ = require('lodash'),
    util = require('./util.js'),
    SpotifyWebApi = require('spotify-web-api-node');

var pickInputs = {
    'type': {key: 'type', validate: { enum: ['user', 'artist'] } },
    'ids': { key: 'ids', type: 'array' }
};

var includeModules = {
    artist: 'followArtists',
    user: 'followUsers'
};

module.exports = {
    /**
     * The main entry point for the Dexter module.
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var spotifyApi = new SpotifyWebApi(),
            token = dexter.provider('spotify').credentials('access_token'),
            inputs = util.pickInputs(step, pickInputs),
            validateErrors = util.checkValidateErrors(inputs, pickInputs);

        if (validateErrors)
            return this.fail(validateErrors);

        var apiType = _.get(inputs, 'type', 'artist'),
            apiIds = _.isArray(inputs.ids)? inputs.ids : [],
            method = includeModules[apiType];

        spotifyApi.setAccessToken(token);
        spotifyApi[method](apiIds).then(function() {

            this.complete({});
        }.bind(this), function(err) {

            this.fail(err);
        }.bind(this));
    }
};
