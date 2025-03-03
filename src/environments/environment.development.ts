interface Environment {
  production: boolean;
  baseApiUrl: string;
}

export const environment: Environment = {
  production: false,
  baseApiUrl: 'http://localhost:3333/',
};
