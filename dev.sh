cd backend && php artisan serve &>/dev/null &
# cd backend && php artisan schedule:work &>/dev/null &
# cd backend && php artisan websockets:serve &>/dev/null &
# cd backend && php artisan websockets:serve --port=6002 &>/dev/null &
cd frontend && npm run dev --watch
