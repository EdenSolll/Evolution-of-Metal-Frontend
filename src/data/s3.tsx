export function getUrl(id: string): Promise<string> {
    return Promise.resolve(`https://s3.csh.rit.edu/songarchive/${id}`);
}
