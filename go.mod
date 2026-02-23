module smtanbin.com/gateway

go 1.25.5

// locally hosted packages are inside the src directory; ensure the go tool
// resolves them to the filesystem instead of attempting to fetch them from the
// network.
replace smtanbin.com/gateway/src/domain => ./src/domain

replace smtanbin.com/gateway/src/domain/endpoint => ./src/domain/endpoint

replace smtanbin.com/gateway/src/usecase/gateway => ./src/usecase/gateway

replace smtanbin.com/gateway/src/interface/http => ./src/interface/http

replace smtanbin.com/gateway/src/services/users => ./src/services/users

require github.com/goccy/go-json v0.10.5

require (
	github.com/andybalholm/brotli v1.2.0 // indirect
	github.com/gofiber/fiber/v3 v3.0.0 // indirect
	github.com/gofiber/schema v1.6.0 // indirect
	github.com/gofiber/utils/v2 v2.0.0 // indirect
	github.com/google/uuid v1.6.0 // indirect
	github.com/jackc/pgpassfile v1.0.0 // indirect
	github.com/jackc/pgservicefile v0.0.0-20240606120523-5a60cdf6a761 // indirect
	github.com/jackc/pgx/v5 v5.6.0 // indirect
	github.com/jackc/puddle/v2 v2.2.2 // indirect
	github.com/jinzhu/inflection v1.0.0 // indirect
	github.com/jinzhu/now v1.1.5 // indirect
	github.com/joho/godotenv v1.5.1 // indirect
	github.com/klauspost/compress v1.18.3 // indirect
	github.com/mattn/go-colorable v0.1.14 // indirect
	github.com/mattn/go-isatty v0.0.20 // indirect
	github.com/philhofer/fwd v1.2.0 // indirect
	github.com/tinylib/msgp v1.6.3 // indirect
	github.com/valyala/bytebufferpool v1.0.0 // indirect
	github.com/valyala/fasthttp v1.69.0 // indirect
	golang.org/x/crypto v0.47.0 // indirect
	golang.org/x/net v0.49.0 // indirect
	golang.org/x/sync v0.19.0 // indirect
	golang.org/x/sys v0.40.0 // indirect
	golang.org/x/text v0.33.0 // indirect
	gorm.io/driver/postgres v1.6.0 // indirect
	gorm.io/gorm v1.31.1 // indirect
)
