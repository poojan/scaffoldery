
test:
	@./node_modules/.bin/mocha -w \
		--require should \
		--timeout 10s \
		--slow 3s \
		--bail \
		--reporter spec

.PHONY: test
