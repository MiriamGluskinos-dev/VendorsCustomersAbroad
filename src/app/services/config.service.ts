//service that  load the configuration
import { Injectable } from "@angular/core";
import { Configuration } from "./config-model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

@Injectable()
export class ConfigService {
  private config!: Configuration;
  constructor(private http: HttpClient) { }

  load(url: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.get<Configuration>(url).subscribe(
        config => {
          this.config = config;
          resolve();
        },
        (err: HttpErrorResponse) => {
          console.error("Failed to load configuration:", err.message);
          reject(err);
        }
      );
    });
  }

  getConfiguration(): Configuration {
    return this.config;
  }
}
