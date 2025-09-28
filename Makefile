PID_FILE := .npm_dev.pid

start:
	docker-compose up -d
	cd src && npm run dev & echo $$! > $(PID_FILE)
	@echo "npm run dev started with PID $$(cat $(PID_FILE))"

stop:
	docker stop $$(docker ps -q)
	@if [ -f $(PID_FILE) ]; then \
		kill $$(cat $(PID_FILE)) && rm -f $(PID_FILE); \
		echo "npm run dev stopped."; \
	else \
		echo "No npm run dev process found."; \
	fi
