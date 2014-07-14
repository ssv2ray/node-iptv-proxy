vlc = require('./providers/vlc-provider');
streamdev = require('./providers/streamdev-provider');
simple = require('./providers/simple-http-provider');

/*
 * Two VLC instances are started, enabling the playback of two
 * channels in parralel
 */

function make_host(host) {
        return {
                control_url: "http://" + host,
                stream_url: "http://" + host + "/stream"
        };
}

var vlc1 = vlc.server(make_host("localhost:80"));
var vlc2 = vlc.server(make_host("localhost:81"));

var vlc_pool = [ vlc1, vlc2 ];

/*
 * Local DVB tunners are also added through VDR+Streamdev
 */
var stm_host = "http://localhost:3000"

/*
 * The simple-http provider is used to re-stream a VLC channel
 * with another name. This is not very usefull, but this provider
 * could also be used to "chain" node-iptv-proxy instances, or
 * simply stream a pre-recorded file hosted on a static http server.
 */
var loop_url = "http://localhost:1234/stream/fr2_hd";

var config_channels = {
        "fr2_hd": vlc.chan("FBX: France 2 HD (TNT)").pool(vlc_pool),
        "fr4_hd": vlc.chan("FBX: France 4 (HD)").pool(vlc_pool),
        "fr5_hd": vlc.chan("FBX: France 5 (HD)").pool(vlc_pool),
        "tf1hd": streamdev.chan("TF1 HD", stm_host),
        "m6hd": streamdev.chan("M6 HD", stm_host),
        "fr2_hd_loop": simple.chan("http://localhost:1234/stream/fr2_hd"),
};

/* use basic config example */
module.exports = {
        server: {
                port: 1234
        },
        channels: config_channels,
};
