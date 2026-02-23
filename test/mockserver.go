package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Printf("\n─── Incoming Request ───────────────────────────\n")
		fmt.Printf("  Method : %s\n", r.Method)
		fmt.Printf("  Path   : %s\n", r.URL.Path)
		fmt.Printf("  Query  : %s\n", r.URL.RawQuery)
		fmt.Printf("  Headers:\n")
		for k, v := range r.Header {
			fmt.Printf("    %s: %s\n", k, v)
		}
		fmt.Printf("────────────────────────────────────────────────\n")

		w.Header().Set("Content-Type", "application/json")
		resp := map[string]any{
			"message": "mock upstream OK",
			"method":  r.Method,
			"path":    r.URL.Path,
			"query":   r.URL.RawQuery,
			"headers": r.Header,
		}
		json.NewEncoder(w).Encode(resp)
	})

	fmt.Println("Mock upstream server listening on :5000")
	log.Fatal(http.ListenAndServe(":5000", nil))
}
