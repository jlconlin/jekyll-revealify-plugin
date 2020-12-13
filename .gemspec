Gem::Specification.new do |spec|
  spec.name          = "jekyll-revealify-plugin"
  spec.version       = "2.0.0.beta"
  spec.authors       = ["Ben Swift", "Harrison Shoebridge"]
  spec.email         = ["helpdesk@cecs.anu.edu.au"]

  spec.summary       = "An opinionated reveal.js plugin for Jekyll"
  spec.homepage      = ""
  spec.license       = "Nonstandard"

  spec.files         = Dir['lib/*.rb']

  spec.add_runtime_dependency "jekyll"
end
