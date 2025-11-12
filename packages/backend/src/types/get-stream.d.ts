declare module "get-stream" {
  function getStream(stream: NodeJS.ReadableStream): Promise<string>;
  namespace getStream {
    function buffer(stream: NodeJS.ReadableStream): Promise<Buffer>;
  }
  export = getStream;
}