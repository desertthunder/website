export const drafts = eleventyConfig => {
  eleventyConfig.addGlobalData('eleventyComputed.permalink', () => data => {
    if (data.draft && !process.env.BUILD_DRAFTS) {
      // Ensure templates that use this handle it correctly
      return false;
    }

    return data.permalink;
  });

  // When `eleventyExcludeFromCollections` is true, the file is not included
  // in any collections.
  //
  // See https://www.11ty.dev/docs/config-preprocessors/#example-drafts
  eleventyConfig.addGlobalData('eleventyComputed.eleventyExcludeFromCollections', () => data => {
    if (data.draft && !process.env.BUILD_DRAFTS) {
      return true;
    }

    return data.eleventyExcludeFromCollections ?? false;
  });

  eleventyConfig.on('eleventy.before', ({runMode}) => {
    if (runMode === 'serve' || runMode === 'watch') {
      process.env.BUILD_DRAFTS = true;
    }
  });
};
