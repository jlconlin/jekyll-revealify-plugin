Gem::Specification.new do |spec|
  spec.name          = "jekyll-revealify-plugin"
  spec.version       = "2.1.0"
  spec.authors       = ["Ben Swift", "Harrison Shoebridge"]
  spec.email         = ["ben.swift@anu.edu.au"]

  spec.summary       = "An opinionated reveal.js plugin for Jekyll"
  spec.homepage      = ""
  spec.license       = "Nonstandard"

  spec.files         = Dir['lib/*.rb']

  spec.add_runtime_dependency "jekyll"
  spec.add_runtime_dependency "nokogiri"
end
