PID_FILE := .npm_dev.pid

start: stop
	docker-compose up -d
	cd frontend && npm run dev & echo $$! > $(PID_FILE)
	@echo "npm run dev started with PID $$(cat $(PID_FILE))"

stop:
	@echo "Stopping only this project's containers and vite..."
	docker-compose down
	@if [ -f $(PID_FILE) ]; then \
		kill $$(cat $(PID_FILE)) 2>/dev/null && rm -f $(PID_FILE); \
		echo "npm run dev stopped."; \
	else \
		echo "No npm run dev process found."; \
	fi
