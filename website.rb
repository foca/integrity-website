require "rubygems"
require "sinatra"

get "/" do
  haml :home
end

get "/notifiers" do
  haml :notifiers
end

get "/configure" do
  haml :configure
end

get "/integrity.css" do
  header "Content-Type" => "text/css; charset=utf-8"
  sass :integrity
end
