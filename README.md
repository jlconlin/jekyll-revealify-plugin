# jekyll-revealify-plugin

`jekyll-revealify-plugin` provides an opinionated way to get Reveal slides
working in Jekyll.

It does two main things:

1. includes the assets for reveal.js and reveal.js-plugins (will be available
   at `{{ "reveal.js" | relative_url }}` and `{{ "reveal.js-plugins" |
   relative_url }}` respectively).
2. includes a default "reveal" layout. If you want different layouts with
   different stylings or features you can create them manually (and use the
   `revealify` Jekyll filter).

You can install it by adding `gem "jekyll-revealify-plugin", :git =>
"https://gitlab.cecs.anu.edu.au/lucy/jekyll-revealify-plugin.git", :branch =>
'master'` to the `jekyll_plugins` group in your Gemfile.

## Using the plugin

The [built in layout](_layouts/reveal.html) is automatically added to your site
when you include this plugin. You can choose to either use it, or construct
your own layout page (in this case, create a new Jekyll layout as normal using
ours as an example).

You can specify the theme file to use by setting the `revealify.theme` variable
in your `_config.yml` file. It should be set to a path to a theme CSS file, if
you were using the default "white" theme it would be
"reveal.js/css/theme/white.css".

To specify a configuration for Reveal itself, add a `revealjs-config.js`
include to your site. This file should be in the format of a JavaScript object
which can be directly pasted into the `Reveal.initialize` function call.
