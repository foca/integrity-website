all: index.html stylesheets/integrity.css
index.html: src/integrity.markdown
	./src/htmlize src/integrity.markdown > index.html
stylesheets/integrity.css: src/integrity.sass
	sass src/integrity.sass stylesheets/integrity.css
clean:
	rm index.html || true
	rm stylesheets/integrity.css || true
