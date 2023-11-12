export const blobToBase64 = (blob: any) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise<string>((resolve) => {
    reader.onloadend = () => {
      resolve(`${reader.result}`);
    };
  });
};

export const getImage = async (text: String) => {
  const res = await fetch(
    "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
    {
      headers: {
        Accept: "image/png",
        Authorization:
          "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: text }),
    }
  );
  const response = await res.blob();
  const data = await blobToBase64(response);
  return data;
};
