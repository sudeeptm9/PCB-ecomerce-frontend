import React, { Fragment } from "react";
import MetaTags from "react-meta-tags";
import LayoutOne from "../../layouts/LayoutOne";
import HeroSliderOne from "../../wrappers/hero-slider/HeroSliderOne";
import FeatureIcon from "../../wrappers/feature-icon/FeatureIcon";
import TabProduct from "../../wrappers/product/TabProduct";
// import BlogFeatured from "../../wrappers/blog-featured/BlogFeatured";

const HomeFashion = () => {
  return (
    <Fragment>
      <MetaTags>
        <title>ProPCB | Home</title>
        <meta
          name="description"
          content="PCB Fabrication"
        />
      </MetaTags>
      <LayoutOne
        headerContainerClass="container-fluid"
        headerPaddingClass="header-padding-1"
      >
        {/* hero slider */}
        <HeroSliderOne />

        {/* tab product */}
        <TabProduct spaceTopClass="pt-100" spaceBottomClass="pb-60" category="fashion" />

        {/* featured icon */}
        <FeatureIcon spaceBottomClass="pb-60" />

        {/* blog featured */}
        {/* <BlogFeatured spaceBottomClass="pb-55" /> */}
      </LayoutOne>
    </Fragment>
  );
};

export default HomeFashion;
