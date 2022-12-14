require 'pathname'

module Jekyll
  class JekyllRevealify < Generator
    priority :high
    safe true

    def generate(site)
      root = Pathname.new(Bundler.rubygems.find_name('jekyll-revealify-plugin').first.full_gem_path)

      #
      # 1. Get static reveal.js assets into Jekyll
      #
      folders = ["reveal.js", "reveal.js-plugins", "chalkboard-redux"]
      folders.each do |folder|
        files = Dir[File.join(root.to_s, "/#{folder}/**/*.*")]

        files = files.map do |f|
          abs = Pathname.new(File.expand_path(f))

          abs.relative_path_from(root.join("#{folder}")).to_s
        end

        files = files.map do |f|
          StaticFile.new(site, root.to_s, "#{folder}", f)
        end

        site.static_files.concat(files)
      end

      #
      # 2. Get the revealify layout into Jekyll
      #
      # We're doing some pretty heinous hacks here to try and get what we want
      # here.
      #
      # The problem: Jekyll's Layout class expects layouts are either in the
      # theme directory, or in the source directory (notable different to the
      # StaticFile API, which doesn't care). 
      #
      # The solution: Since the logic which cares about this stuff only is
      # contained to the `initialize` function, we can create a Layout object
      # that ignores it---and runs our own version of that exact same logic.
      #
      # For future reference, the code I've based the following on is here:
      # https://github.com/jekyll/jekyll/blob/a7e1ec901b26bebaf3c973296f765356909a1d0d/lib/jekyll/layout.rb#L33-L51
      #
      abs = root.join("_layouts")
      p = abs.relative_path_from(Pathname.new(site.source))

      layout_folder = "_layouts"
      layout_file_name = "reveal.html"

      layout = Layout.allocate # create a Layout, but don't run the initialize function

      layout.instance_variable_set(:@site, site)
      layout.instance_variable_set(:@base, layout_folder)
      layout.instance_variable_set(:@name, layout_file_name)

      layout.instance_variable_set(:@base_dir, root.to_s)
      layout.instance_variable_set(:@path, abs.join(layout_file_name).to_s)

      layout.instance_variable_set(:@relative_path, p.to_s)

      layout.send(:process, layout.name)

      layout.data = {}

      # because we have set the `path` variable, these parameters are never
      # actually used. why are they required? no idea.
      layout.send(:read_yaml, "doesn't matter", "either")

      site.layouts["reveal"] = layout
    end
  end
end
