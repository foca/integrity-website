* This list will contain the toc (it doesn't matter what you write here)
{:toc}

What's this? {#about}
============

Integrity is the angel watching over your shoulder while you code. As soon
as you push your commits, it builds, runs your tests, and makes sure
everything works fine.

It then reports the build status using [various notifiers][notifiers]
back to your team so everyone's on the same page, and if there's a problem,
you can get it fixed right away.

Read more about [Continuous Integration][ci] on Wikipedia.

Live demo {#demo}
=========

See how integrity works for yourself on [our own install][demo], watching
Integrity itself and the [various notifiers][notifiers].

Installation and deployment {#setup}
===========================

__It's ridiculously easy.__ All you need is to have `ruby` and `rubygems`
installed on your server, and then run the built-in installer.

    $ gem install integrity
    $ integrity install /home/www-data/integrity

This will create a couple files on your server,
mainly `config.yml` and `config.ru`.

You may encounter an error suggesting that `integrity_projects` table is missing in-spite of the output of the install command above; in that case try the following:

    $ integrity migrate_db config.yml

The installer provides special configuration files for [Thin][]
and [Passenger][].

Passenger
---------

    $ integrity install --passenger ~www-data/integrity
    $ cd ~www-data/integrity

Then, tell Passenger to start your app: `$ touch tmp/restart.txt`

Thin
----

1. Make sure [Thin][] is installed:

        $ gem install thin` otherwise.

2. Run the installer:

        $ integrity install --thin ~www-data/integrity
        $ cd ~www-data/integrity`

3. Tweak `thin.yml` to your need if necessary.

4. Then, to start the Thin server, just do this:

        $ thin -C thin.yml -R config.ru start

Configure a web proxy {#proxy}
---------------------

### nginx {#nginx}

    http {
      upstream builder-integrityapp-com {
        server 127.0.0.1:8910;
        server 127.0.0.1:8911;
      }

      server {
        server_name builder.integrityapp.com;
        location / {
          proxy_pass http://builder-integrityapp-com;
        }
      }
    }

### Apache acting as reverse proxy to a cluster of thin instances {#apache-pxy}

    <VirtualHost *>
      <Proxy>
        Order deny,allow
        Allow from all
      </Proxy>

      RedirectMatch ^/integrity$ /integrity/
      ProxyRequests Off
      ProxyPass /integrity/ http://localhost:8910/
      ProxyHTMLURLMap http://localhost:8910 /integrity

      <Location /integrity>
        ProxyPassReverse /
        SetOutputFilter proxy-html
        ProxyHTMLURLMap / /integrity/
        ProxyHTMLURLMap /integrity/ /integrity
      </Location>
    </VirtualHost>

If you run Integrity behind Passenger, or other deployment strategy, drop
us a line at <info@integrityapp.com> and let us know what config worked
for you so we can include it here :-)

Configuration {#configure}
=============

This step should be pretty pretty stepforward. You only need to touch one file:

    /path/to/integrity/config.yml

All options are explained in the file. In case you want to see them anyway,
you can see the [source file on GitHub][configsrc].

Notifiers
=========

After a build is finished, you want to know the status __immediately.__
Integrity gives you a modular notification's system for this.

With Integrity, you can receive your notifications in a few different ways.
Don't worry, all of these are easy to set up:

- [Email](http://github.com/foca/integrity-email),
  by [Nicolás Sanguinetti][foca]
- [Jabber](http://github.com/ph/integrity-jabber),
  by [Pier-Hugues Pellerin](http://heykimo.com)
- [Campfire](http://github.com/defunkt/integrity-campfire),
  by [Chris Wanstrath](http://ozmm.org)
- [IRC](http://github.com/sr/integrity-irc), by [Simon Rozet][sr]
- [Twitter](http://github.com/cwsaylor/integrity-twitter),
  by [Chris Saylor](http://justhack.com)
- [Basecamp](http://github.com/pyrat/integrity-basecamp), by
  [Alastair Brunton](http://www.simplyexcited.co.uk)
- [Yammer](http://github.com/jstewart/integrity-yammer/tree), by
  [Jason Stewart](http://github.com/jstewart)

**NOTE:** If you wrote a notifier for something else, let us know at
<info@integrityapp.com> and we'll add you here :)

Setting up your notifier {#setup-notifier}
------------------------

Also a piece of cake. For example, for email notifications:

    $ gem install integrity-email

And then edit the `config.ru` file in your Integrity install directory:

    require "rubygems"
    require "integrity"

    # You need to add the following line:
    require "integrity/notifier/email"

Finally, restart Integrity. That's it. Now you can browse to
<http://ci.example.org/my-project/edit> and configure your notifier.

**NOTE:** Due to recent changes in Integrity's internals, notifiers now needs
to be registered. However, all notifiers haven't been updated yet,
so you might have to do it yourself into the `config.ru` file:

    require "rubygems"
    require "integrity"
    require "integrity/notifier/email"

    Integrity::Notifier.register(Integrity::Notifier::Email)

FAQ {#faq}
===

But does it work with *&lt;insert tech here&gt;*? {#other-tech}
-------------------------------------------------

Short answer: __Yeah!__

Slightly longer answer: as long as your build process can be run from an unix-y
environment __and__ it returns a *zero* status code for
success and _non-zero_ for failure, then integrity works for you.

How to use Integrity with a local repository? {#local}
---------------------------------------------

Set the project URI's to point to the `.git` directory of the
repository: `/home/sr/code/integrity/.git`

[git-sub]: http://www.kernel.org/pub/software/scm/git/docs/git-submodule.html

How do I use git submodules with Integrity? {#git-sub}
-------------------------------------------

Use this as your build command: `git submodules update --init && rake test`
It'll fetch and update the submodules everytime the project is build.

How to handle database.yml and similar unversioned files? {#database-yml}
---------------------------------------------------------
__Integrity is dumb__. it takes a repository URL and a command to run in a
working copy of the former.
It then reports success or failure depending on the [exit status][exit] of the
command.

While this is very simplistic, it allows for great flexibility: you can use
whatever you want as the build command.

So, to handle `database.yml`, you can either use a build command like this:

    cp config/database.sample.yml config/database.yml && rake test

Or use a Rake task. Example:

    namespace :test do
      task :write_test_db_config do
        file = File.join(Rails.root, "config", "database.yml")
        File.open(file), "w") { |config|
          config << "...."
        }
      end
    end

How do I use metric\_fu ? {#metricfu}
------------------------

Basically, it's the same as for [database.yml](/#database-yml). See our
[Rakefile](http://github.com/foca/integrity/blob/0.1.9/Rakefile#L16)
for an example.

Suport / Development {#support}
====================

[#integrity]: irc://irc.freenode.net:6667/integrity
You can get in touch via IRC at [#integrity][] on freenode. If no one happens
to be around the IRC channel, you can ask in our [mailing list][ml].

If you find a bug, or want to give us a feature request, drop by our
[Lighthouse][] tracker.

If you want to check out the code, you can do so at our [GitHub project][src]

[configure]: /#configure
[notifiers]: /#notifiers
[demo]: http://builder.integrityapp.com
[src]: http://github.com/foca/integrity
[lighthouse]: http://integrity.lighthouseapp.com
[ml]: integrity@librelist.com
[configsrc]: http://github.com/foca/integrity/blob/3d1ba4b8cde7241dacd641eb40e9f26c49fbea35/config/config.sample.yml
[Thin]: http://code.macournoyer.com/thin
[Passenger]: http://www.modrails.com/
[nginx]: http://nginx.net
[ci]: http://en.wikipedia.org/wiki/Continuous_Integration
[exit]: http://en.wikipedia.org/wiki/Exit_status#Unix
[foca]: http://nicolassanguinetti.info
[sr]: http://atonie.org
