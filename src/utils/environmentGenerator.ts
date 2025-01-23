export const envionmentGenerator = (envVariables: any) =>
    Object.keys(envVariables).reduce(
      (prev, curr) => ({
        ...prev,
        [curr]: import.meta.env[envVariables[curr]]
      }),
      {} as typeof envVariables
    );
  
  export const variablesExist = (environment: any, envVariables: any) => {
    const missingVariables = Object.keys(environment).reduce((prev: string[], curr) => {
      const variable = environment[curr];
      if (!variable) {
        prev = [...prev, envVariables[curr]];
      }
      return prev;
    }, [] as string[]);
  
    if (missingVariables.length) {
      const message = `The following env variables are missing \n${missingVariables.join(
        "\r\n"
      )}`;
      throw new Error(message);
    }
  };
  