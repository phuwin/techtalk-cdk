export async function main(event : any) {
  console.log('event 👉', event);
  console.log('i am run')

  return {
    body: JSON.stringify({message: 'Successful lambda invocation'}),
    statusCode: 200,
  };
}