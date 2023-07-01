import PropTypes from "prop-types";
import React, { Fragment, useContext } from "react";
// import { useState } from "react";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
// import LocationMap from "../../components/contact/LocationMap";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import * as price from "../../data/price.json";
import axios from "axios";
// import { UserContext } from "../../App";
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import { useToasts } from "react-toast-notifications";
import S3 from "react-aws-s3";
import { useAsyncDeepState } from "use-async-effect2";
import { useEffect } from "react";

const Quote = ({ location }) => {
  let history = useHistory();
  const { addToast } = useToasts();
  const cookies = new Cookies();
  const email = cookies.get("Email") || null;
  const { pathname } = location;
  const [formValues, setFormValues] = useAsyncDeepState({
    Base_material: "FR-4",
    Layers: 2,
    dimensionwidth: 100,
    dimensionheight: 100,
    Dimensions: "mm",
    Quantity: 5,
    product_type: "Industrial/Commercial electronic",
    Different_Design: 1,
    delivery_format: "singlepcb",
    pcb_thickness: 1.6,
    pcb_color: "green",
    silkscreen: "white",
    surface_finish: "HASL(with lead)",
    outercopperweight: "1oz",
    goldfingers: "No",
    ConfirmProductionFile: "No",
    flyingProbeTest: "fullytest",
    castellatedHoles: "No",
    RemoveOrderNumber: "No",
    email: "",
    total: 0,
    filelocation: "",
  });

  const config = {
    bucketName: "propcb",
    region: "ap-south-1",
    accessKeyId: "AKIA2VK5A5XIBKNO6KWE",
    secretAccessKey: "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",
  };

  const ReactS3Client = new S3(config);
  const handleFileChange = (e) => {
    ReactS3Client.uploadFile(e.target.files[0], e.target.files[0].name)
      .then((data) => {
        setFormValues(({ state }) => ({
          ...state,
          filelocation: data.location,
        }));
      })
      .catch((err) => console.error(err));
  };

  let Total = 0;
  const handleChange = (e) => {
    e.preventDefault();
    switch (e.target.name) {
      case "Base_material":
        setFormValues(({ state }) => ({
          ...state,
          Base_material: e.target.value,
        }));
        break;
      case "Layers":
        setFormValues(({ state }) => ({ ...state, Layers: e.target.value }));
        break;
      case "dimensionwidth":
        setFormValues(({ state }) => ({
          ...state,
          dimensionwidth: e.target.value,
        }));
        break;
      case "dimensionheight":
        setFormValues(({ state }) => ({
          ...state,
          dimensionheight: e.target.value,
        }));
        break;
      case "Dimensions":
        setFormValues(({ state }) => ({
          ...state,
          Dimensions: e.target.value,
        }));
        break;
      case "Quantity":
        setFormValues(({ state }) => ({ ...state, Quantity: e.target.value }));
        break;
      case "product_type":
        setFormValues(({ state }) => ({
          ...state,
          product_type: e.target.value,
        }));
        break;
      case "Different_Design":
        setFormValues(({ state }) => ({
          ...state,
          Different_Design: e.target.value,
        }));
        break;
      case "delivery_format":
        setFormValues(({ state }) => ({
          ...state,
          delivery_format: e.target.value,
        }));
        break;
      case "pcb_thickness":
        setFormValues(({ state }) => ({
          ...state,
          pcb_thickness: e.target.value,
        }));
        break;
      case "pcb_color":
        setFormValues(({ state }) => ({ ...state, pcb_color: e.target.value }));
        break;
      case "silkscreen":
        setFormValues(({ state }) => ({
          ...state,
          silkscreen: e.target.value,
        }));
        break;
      case "surface_finish":
        setFormValues(({ state }) => ({
          ...state,
          surface_finish: e.target.value,
        }));
        break;
      case "outercopperweight":
        setFormValues(({ state }) => ({
          ...state,
          outercopperweight: e.target.value,
        }));
        break;
      case "goldfingers":
        setFormValues(({ state }) => ({
          ...state,
          goldfingers: e.target.value,
        }));
        break;
      case "ConfirmProductionFile":
        setFormValues(({ state }) => ({
          ...state,
          ConfirmProductionFile: e.target.value,
        }));
        break;
      case "flyingProbeTest":
        setFormValues(({ state }) => ({
          ...state,
          flyingProbeTest: e.target.value,
        }));
        break;
      case "castellatedHoles":
        setFormValues(({ state }) => ({
          ...state,
          castellatedHoles: e.target.value,
        }));
        break;
      case "RemoveOrderNumber":
        setFormValues(({ state }) => ({
          ...state,
          RemoveOrderNumber: e.target.value,
        }));
        break;
      default:
        console.log("Error");
    }
    let totalvalue = calculate();
    setFormValues(({ state }) => ({
      ...state,
      total: totalvalue,
    }));
    // console.log(typeof formValues["goldfingers"] );
  };

  const calculate = () => {
    let basematerialcost =
      formValues["Base_material"] === "FR-4"
        ? price["Base_material"]["FR-4"]
        : price["Base_material"]["Aluminium"];

    let layercost =
      formValues["Layers"] === "1"
        ? price["Layers"]["1"]
        : price["Layers"]["2"];

    let dimensioncost =
      formValues["Dimensions"] === "mm"
        ? formValues["dimensionwidth"] *
            price["dimension"]["mm"]["dimensionwidth"] +
          formValues["dimensionheight"] *
            price["dimension"]["mm"]["dimensionheight"]
        : formValues["dimensionwidth"] *
            price["dimension"]["inch"]["dimensionwidth"] +
          formValues["dimensionheight"] *
            price["dimension"]["inch"]["dimensionheight"];

    let quantitycost = formValues["Quantity"] * price["Quantity"];

    let producttypecost;
    switch (formValues["product_type"]) {
      case "Industrial/Commercial electronic":
        producttypecost =
          price["product_type"]["Industrial/Commercial electronic"];
        break;
      case "Aerospace":
        producttypecost = price["product_type"]["Aerospace"];
        break;
      case "Medical":
        producttypecost = price["product_type"]["Medical"];
        break;
      default:
        console.log("Error");
    }

    let differentdesigncost;
    switch (parseInt(formValues["Different_Design"])) {
      case 1:
        differentdesigncost = price["Different_Design"]["1"];
        break;
      case 2:
        differentdesigncost = price["Different_Design"]["2"];
        break;
      case 3:
        differentdesigncost = price["Different_Design"]["3"];
        break;
      case 4:
        differentdesigncost = price["Different_Design"]["4"];
        break;
      default:
        console.log("error");
    }

    let deliveryformatcost;
    switch (formValues["delivery_format"]) {
      case "singlepcb":
        deliveryformatcost = price["delivery_format"]["singlepcb"];
        break;
      case "panelbycustomer":
        deliveryformatcost = price["delivery_format"]["panelbycustomer"];
        break;
      case "panelbypropcb":
        deliveryformatcost = price["delivery_format"]["panelbypropcb"];
        break;
      default:
        console.log("error");
    }

    let pcbthicknesscost;
    switch (parseFloat(formValues["pcb_thickness"])) {
      case 0.4:
        pcbthicknesscost = price["pcb_thickness"]["0.4"];
        break;
      case 0.6:
        pcbthicknesscost = price["pcb_thickness"]["0.6"];
        break;
      case 0.8:
        pcbthicknesscost = price["pcb_thickness"]["0.8"];
        break;
      case 1.0:
        pcbthicknesscost = price["pcb_thickness"]["1.0"];
        break;
      case 1.2:
        pcbthicknesscost = price["pcb_thickness"]["1.2"];
        break;
      case 1.6:
        pcbthicknesscost = price["pcb_thickness"]["1.6"];
        break;
      case 2.0:
        pcbthicknesscost = price["pcb_thickness"]["2.0"];
        break;
      default:
        console.log("error");
    }

    let pcbcolourcost;
    switch (formValues["pcb_color"]) {
      case "green":
        pcbcolourcost = price["pcb_color"]["green"];
        break;
      case "red":
        pcbcolourcost = price["pcb_color"]["red"];
        break;
      case "yellow":
        pcbcolourcost = price["pcb_color"]["yellow"];
        break;
      case "blue":
        pcbcolourcost = price["pcb_color"]["blue"];
        break;
      case "white":
        pcbcolourcost = price["pcb_color"]["white"];
        break;
      case "black":
        pcbcolourcost = price["pcb_color"]["black"];
        break;
      default:
        console.log("error");
    }

    let silkscreencost = price["silkscreen"]; //silk screen cost change

    let surfacefinishcost;
    switch (formValues["surface_finish"]) {
      case "HASL(with lead)":
        surfacefinishcost = price["surface_finish"]["HASL(with lead)"];
        break;
      case "LeadFree HASL-RoHS":
        surfacefinishcost = price["surface_finish"]["LeadFree HASL-RoHS"];
        break;
      case "ENIG-ROHS":
        surfacefinishcost = price["surface_finish"]["ENIG-ROHS"];
        break;
      default:
        console.log("error");
    }

    let outercopperweightcost =
      formValues["outercopperweight"] === "1oz"
        ? price["outercopperweight"]["1oz"]
        : price["outercopperweight"]["2oz"];

    let goldfingerscost =
      formValues["goldfingers"] === "No"
        ? price["goldfingers"]["No"]
        : price["goldfingers"]["Yes"];

    let confirmproductionfilecost =
      formValues["ConfirmProductionFile"] === "No"
        ? price["ConfirmProductionFile"]["No"]
        : price["ConfirmProductionFile"]["Yes"];

    let flyingProbeTestcost =
      formValues["flyingProbeTest"] === "fullytest"
        ? price["flyingProbeTest"]["fullytest"]
        : price["flyingProbeTest"]["nottest"];

    let castellatedHolescost =
      formValues["castellatedHoles"] === "No"
        ? price["castellatedHoles"]["No"]
        : price["castellatedHoles"]["Yes"];

    let removeordernumbercost =
      formValues["RemoveOrderNumber"] === "No"
        ? price["RemoveOrderNumber"]["No"]
        : price["RemoveOrderNumber"]["Yes"];

    Total =
      basematerialcost +
      layercost +
      dimensioncost +
      quantitycost +
      producttypecost +
      differentdesigncost +
      deliveryformatcost +
      pcbthicknesscost +
      pcbcolourcost +
      silkscreencost +
      surfacefinishcost +
      outercopperweightcost +
      goldfingerscost +
      confirmproductionfilecost +
      flyingProbeTestcost +
      castellatedHolescost +
      removeordernumbercost;

    return Total;
  };
  useEffect(() => {
    let totalvalue = calculate();
    setFormValues(({ state }) => ({
      ...state,
      total: totalvalue,
    }));
  }, []);

  return (
    <Fragment>
      <MetaTags>
        <title>ProPCB | Quote</title>
        <meta name="description" content="Get quote of your pcb" />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Quote
      </BreadcrumbsItem>
      <LayoutOne>
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="contact-area pt-100 pb-100">
          <div className="container" style={{ margin: 0, maxWidth: "1450px" }}>
            <div className="custom-row-2">
              <div className="col-lg-9 col-md-8">
                <div
                  className="contact-form"
                  style={{ padding: "50px 110px 50px 60px" }}
                >
                  <div className="contact-title mb-30">
                    <h2>PCB</h2>
                  </div>
                  <form className="contact-form-style ">
                    <div className="row quote-form">
                      <div className="col-lg-12 form-items quote">
                        <label>Base Material</label>
                        <ul>
                          <li>
                            <RadioGroup
                              row
                              aria-labelledby="demo-controlled-radio-buttons-group"
                              name="Base_material"
                              // value={formValues["Base_material"]}
                              onChange={handleChange}
                              defaultValue="FR-4"
                            >
                              <FormControlLabel
                                value="FR-4"
                                control={<Radio />}
                                label="FR-4"
                              />
                              <FormControlLabel
                                value="Aluminium"
                                control={<Radio />}
                                label="Aluminium"
                              />
                            </RadioGroup>
                          </li>
                        </ul>
                      </div>
                      <div className="col-lg-12 form-items quote">
                        <label>Layers</label>
                        <ul>
                          <li>
                            <RadioGroup
                              row
                              aria-labelledby="demo-controlled-radio-buttons-group"
                              name="Layers"
                              // value={value}
                              onChange={handleChange}
                              defaultValue="2"
                            >
                              <FormControlLabel
                                value="1"
                                control={<Radio />}
                                label="1"
                              />
                              <FormControlLabel
                                value="2"
                                control={<Radio />}
                                label="2"
                              />
                            </RadioGroup>
                          </li>
                        </ul>
                      </div>
                      <div className="col-lg-12 form-items form-inputdiv quote">
                        <label>Dimension</label>
                        <ul>
                          <li>
                            <input
                              type="text"
                              defaultValue={100}
                              className="form-input"
                              name="dimensionwidth"
                              onChange={handleChange}
                            />
                          </li>
                          <p className="form-input">*</p>
                          <li>
                            <input
                              type="text"
                              defaultValue={100}
                              className="form-input"
                              name="dimensionheight"
                              onChange={handleChange}
                            />
                          </li>
                          <li>
                            <select
                              name="Dimensions"
                              onChange={handleChange}
                              defaultValue="mm"
                            >
                              <option value="mm">mm</option>
                              <option value="inch">inch</option>
                            </select>
                          </li>
                        </ul>
                      </div>
                      <div className="col-lg-12 form-items quote">
                        <label>PCB Qty</label>
                        <ul>
                          <li>
                            <select
                              name="Quantity"
                              onChange={handleChange}
                              defaultValue="5"
                            >
                              <option value="5">5</option>
                              <option value="10">10</option>
                              <option value="15">15</option>
                              <option value="20">20</option>
                              <option value="25">25</option>
                              <option value="30">30</option>
                              <option value="50">50</option>
                              <option value="75">75</option>
                              <option value="100">100</option>
                              <option value="125">125</option>
                              <option value="150">150</option>
                            </select>
                          </li>
                        </ul>
                      </div>
                      {/* <div className="col-lg-12 form-items quote">
                        <label>Product Type</label>
                        <ul>
                          <li>
                            <RadioGroup
                              row
                              aria-labelledby="demo-controlled-radio-buttons-group"
                              name="product_type"
                              // value={value}
                              onChange={handleChange}
                              defaultValue="Industrial/Commercial electronic"
                            >
                              <FormControlLabel
                                value="Industrial/Commercial electronic"
                                control={<Radio />}
                                label="Industrial/Commercial electronic"
                              />
                              <FormControlLabel
                                value="Aerospace"
                                control={<Radio />}
                                label="Aerospace"
                              />
                              <FormControlLabel
                                value="Medical"
                                control={<Radio />}
                                label="Medical"
                              />
                            </RadioGroup>
                          </li>
                        </ul>
                      </div> */}
                      <div className="col-lg-12 form-items quote">
                        <label>Different Design</label>
                        <ul>
                          <li>
                            <RadioGroup
                              row
                              aria-labelledby="demo-controlled-radio-buttons-group"
                              name="Different_Design"
                              // value={value}
                              onChange={handleChange}
                              defaultValue="1"
                            >
                              <FormControlLabel
                                value="1"
                                control={<Radio />}
                                label="1"
                              />
                              <FormControlLabel
                                value="2"
                                control={<Radio />}
                                label="2"
                              />
                              <FormControlLabel
                                value="3"
                                control={<Radio />}
                                label="3"
                              />
                              <FormControlLabel
                                value="4"
                                control={<Radio />}
                                label="4"
                              />
                            </RadioGroup>
                          </li>
                        </ul>
                      </div>
                      <div className="col-lg-12 form-items quote">
                        <label>Delivery Format</label>
                        <ul>
                          <li>
                            <RadioGroup
                              row
                              aria-labelledby="demo-controlled-radio-buttons-group"
                              name="delivery_format"
                              // value={value}
                              onChange={handleChange}
                              defaultValue="singlepcb"
                            >
                              <FormControlLabel
                                value="singlepcb"
                                control={<Radio />}
                                label="Single pcb"
                              />
                              <FormControlLabel
                                value="panelbycustomer"
                                control={<Radio />}
                                label="panel by customer"
                              />
                              <FormControlLabel
                                value="panelbypropcb"
                                control={<Radio />}
                                label="panel by propcb"
                              />
                            </RadioGroup>
                          </li>
                        </ul>
                      </div>
                      <div className="col-lg-12 form-items quote">
                        <label>PCB Thickness</label>
                        <ul>
                          <li>
                            <RadioGroup
                              row
                              aria-labelledby="demo-controlled-radio-buttons-group"
                              name="pcb_thickness"
                              // value={value}
                              onChange={handleChange}
                              defaultValue="1.6"
                            >
                              <FormControlLabel
                                value="0.4"
                                control={<Radio />}
                                label="0.4"
                              />
                              <FormControlLabel
                                value="0.6"
                                control={<Radio />}
                                label="0.6"
                              />
                              <FormControlLabel
                                value="0.8"
                                control={<Radio />}
                                label="0.8"
                              />
                              <FormControlLabel
                                value="1.0"
                                control={<Radio />}
                                label="1.0"
                              />
                              <FormControlLabel
                                value="1.2"
                                control={<Radio />}
                                label="1.2"
                              />
                              <FormControlLabel
                                value="1.6"
                                control={<Radio />}
                                label="1.6"
                              />
                              <FormControlLabel
                                value="2.0"
                                control={<Radio />}
                                label="2.0"
                              />
                            </RadioGroup>
                          </li>
                        </ul>
                      </div>
                      <div className="col-lg-12 form-items quote">
                        <label>PCB Colour</label>
                        <ul>
                          <li>
                            <RadioGroup
                              row
                              aria-labelledby="demo-controlled-radio-buttons-group"
                              name="pcb_color"
                              // value={value}
                              onChange={handleChange}
                              defaultValue="green"
                            >
                              <FormControlLabel
                                value="green"
                                control={<Radio />}
                                label="green"
                              />
                              <FormControlLabel
                                value="red"
                                control={<Radio />}
                                label="red"
                              />
                              <FormControlLabel
                                value="yellow"
                                control={<Radio />}
                                label="yellow"
                              />
                              <FormControlLabel
                                value="blue"
                                control={<Radio />}
                                label="Blue"
                              />
                              <FormControlLabel
                                value="white"
                                control={<Radio />}
                                label="white"
                              />
                              <FormControlLabel
                                value="black"
                                control={<Radio />}
                                label="black"
                              />
                            </RadioGroup>
                          </li>
                        </ul>
                      </div>
                      <div className="col-lg-12 form-items quote">
                        <label>Silkscreen</label>
                        <ul>
                          <li>
                            <RadioGroup
                              row
                              aria-labelledby="demo-controlled-radio-buttons-group"
                              name="silkscreen"
                              // value={value}
                              onChange={handleChange}
                              defaultValue="white"
                            >
                              <FormControlLabel
                                value="white"
                                control={<Radio />}
                                label="White"
                              />
                              <FormControlLabel
                                value="black"
                                control={<Radio />}
                                label="Black"
                              />
                            </RadioGroup>
                          </li>
                        </ul>
                      </div>
                      <div className="col-lg-12 form-items quote">
                        <label>Surface Finish</label>
                        <ul>
                          <li>
                            <RadioGroup
                              style={{ display: "inline-flex" }}
                              aria-labelledby="demo-controlled-radio-buttons-group"
                              name="surface_finish"
                              row
                              // value={value}
                              onChange={handleChange}
                              defaultValue="HASL(with lead)"
                            >
                              <FormControlLabel
                                style={{ display: "inline-flex" }}
                                value="HASL(with lead)"
                                control={<Radio />}
                                label="HASL(with lead)"
                              />
                              <FormControlLabel
                                style={{ display: "inline-flex" }}
                                value="LeadFree HASL-RoHS"
                                control={<Radio />}
                                label="LeadFree HASL-RoHS"
                              />
                              <FormControlLabel
                                style={{ display: "inline-flex" }}
                                value="ENIG-ROHS"
                                control={<Radio />}
                                label="ENIG-ROHS"
                              />
                            </RadioGroup>
                          </li>
                        </ul>
                      </div>
                      <div className="col-lg-12 form-items quote">
                        <label>Outer Copper Weight</label>
                        <ul>
                          <li>
                            <RadioGroup
                              style={{ display: "inline-flex" }}
                              aria-labelledby="demo-controlled-radio-buttons-group"
                              name="outercopperweight"
                              row
                              // value={value}
                              onChange={handleChange}
                              defaultValue="1oz"
                            >
                              <FormControlLabel
                                style={{ display: "inline-flex" }}
                                value="1oz"
                                control={<Radio />}
                                label="1 oz"
                              />
                              <FormControlLabel
                                style={{ display: "inline-flex" }}
                                value="2oz"
                                control={<Radio />}
                                label="2 oz"
                              />
                            </RadioGroup>
                          </li>
                        </ul>
                      </div>
                      <div className="col-lg-12 form-items quote">
                        <label>Gold Fingers</label>
                        <ul>
                          <li>
                            <RadioGroup
                              style={{ display: "inline-flex" }}
                              row
                              aria-labelledby="demo-controlled-radio-buttons-group"
                              name="goldfingers"
                              // value={value}
                              onChange={handleChange}
                              defaultValue="No"
                            >
                              <FormControlLabel
                                style={{ display: "inline-flex" }}
                                value="No"
                                control={<Radio />}
                                label="No"
                              />
                              <FormControlLabel
                                style={{ display: "inline-flex" }}
                                value="Yes"
                                control={<Radio />}
                                label="Yes"
                              />
                            </RadioGroup>
                          </li>
                        </ul>
                      </div>
                      <div className="col-lg-12 form-items quote">
                        <label>Confirm Production file</label>
                        <ul>
                          <li>
                            <RadioGroup
                              style={{ display: "inline-flex" }}
                              aria-labelledby="demo-controlled-radio-buttons-group"
                              name="ConfirmProductionFile"
                              row
                              // value={value}
                              onChange={handleChange}
                              defaultValue="No"
                            >
                              <FormControlLabel
                                style={{ display: "inline-flex" }}
                                value="No"
                                control={<Radio />}
                                label="No"
                              />
                              <FormControlLabel
                                style={{ display: "inline-flex" }}
                                value="Yes"
                                control={<Radio />}
                                label="Yes"
                              />
                            </RadioGroup>
                          </li>
                        </ul>
                      </div>
                      <div className="col-lg-12 form-items quote">
                        <label>Flying Probe Test</label>
                        <ul>
                          <li>
                            <RadioGroup
                              style={{ display: "inline-flex" }}
                              aria-labelledby="demo-controlled-radio-buttons-group"
                              name="flyingProbeTest"
                              row
                              // value={value}
                              onChange={handleChange}
                              defaultValue="fullytest"
                            >
                              <FormControlLabel
                                style={{ display: "inline-flex" }}
                                value="fullytest"
                                control={<Radio />}
                                label="Fully Test"
                              />
                            </RadioGroup>
                          </li>
                        </ul>
                      </div>
                      <div className="col-lg-12 form-items quote">
                        <label>Castellated Holes</label>
                        <ul>
                          <li>
                            <RadioGroup
                              style={{ display: "inline-flex" }}
                              aria-labelledby="demo-controlled-radio-buttons-group"
                              name="castellatedHoles"
                              row
                              // value={value}
                              onChange={handleChange}
                              defaultValue="No"
                            >
                              <FormControlLabel
                                style={{ display: "inline-flex" }}
                                value="No"
                                control={<Radio />}
                                label="No"
                              />
                              <FormControlLabel
                                style={{ display: "inline-flex" }}
                                value="Yes"
                                control={<Radio />}
                                label="Yes"
                              />
                            </RadioGroup>
                          </li>
                        </ul>
                      </div>
                      <div className="col-lg-12 form-items quote">
                        <label>Remove Order Number</label>
                        <ul>
                          <li>
                            <RadioGroup
                              style={{ display: "inline-flex" }}
                              aria-labelledby="demo-controlled-radio-buttons-group"
                              name="RemoveOrderNumber"
                              row
                              // value={value}
                              onChange={handleChange}
                              defaultValue="No"
                            >
                              <FormControlLabel
                                style={{ display: "inline-flex" }}
                                value="No"
                                control={<Radio />}
                                label="No"
                              />
                              <FormControlLabel
                                style={{ display: "inline-flex" }}
                                value="Yes"
                                control={<Radio />}
                                label="Yes"
                              />
                            </RadioGroup>
                          </li>
                          {/* <li>
                            <input
                              type="text"
                              placeholder="Specify a Location"
                            ></input>
                          </li> */}
                        </ul>
                      </div>
                      <div className="col-lg-12 form-items quote">
                        <label>
                          Please provide the design files(in zip format)
                        </label>
                        <input
                          type="file"
                          style={{ border: "none", marginBottom: 0 }}
                          accept=".zip,.rar"
                          onChange={handleFileChange}
                        ></input>
                      </div>
                      {/* <div className="col-lg-12">
                        <textarea
                          name="message"
                          placeholder="Your Message*"
                          defaultValue={""}
                        /> 
                        
                      </div> */}
                    </div>
                  </form>
                  <p className="form-message" />
                </div>
              </div>
              <div className="col-lg-3 col-md-4">
                <div className="contact-info-wrap">
                  {/* <div className="single-contact-info">
                    <div className="contact-icon">
                      <i className="fa fa-phone" />
                    </div>
                    <div className="contact-info-dec">
                      <p>+012 345 678 102</p>
                      <p>+012 345 678 102</p>
                    </div>
                  </div> */}
                  {/* <div className="single-contact-info">
                    <div className="contact-icon">
                      <i className="fa fa-globe" />
                    </div>
                    <div className="contact-info-dec">
                      <p>
                        <a href="mailto:yourname@email.com">
                          yourname@email.com
                        </a>
                      </p>
                      <p>
                        <a href="https://yourwebsitename.com">
                          yourwebsitename.com
                        </a>
                      </p>
                    </div>
                  </div> */}
                  {/* <div className="single-contact-info">
                    <div className="contact-icon">
                      <i className="fa fa-map-marker" />
                    </div>
                    <div className="contact-info-dec">
                      <p>Address goes here, </p>
                      <p>street, Crossroad 123.</p>
                    </div>
                  </div> */}
                  {formValues.Quantity > 50 ? (
                    <div className="cart-btn">
                      <p>
                        *Custom quote will be sent on to mail for quantity above
                        50
                      </p>
                      {email != null ? (
                        <button
                          className="submit"
                          type="submit"
                          onClick={async () => {
                            addToast(
                              "Email sent successfully, you will be recieving reply soon",
                              {
                                appearance: "success",
                              }
                            );
                          }}
                        >
                          Request Custom Quote
                        </button>
                      ) : (
                        <>
                          <p>Login before adding to cart</p>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              history.push(pathname);
                              window.location.replace("/login-register");
                            }}
                          >
                            Login
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div>
                        <p>
                          *Custom quote will be sent on to mail for quantity
                          above 50
                        </p>
                        <h4>Calculated Price: {calculate()}</h4>
                        <p>*Including GST</p>
                      </div>
                      <div className="cart-btn">
                        {email != null ? (
                          <button
                            className="submit"
                            type="submit"
                            onClick={async () => {
                              setFormValues(({ state }) => ({
                                ...state,
                                email: email,
                              }));
                              let res = await axios.post(
                                "http://localhost:8080/cart",
                                formValues,
                                {
                                  headers: {
                                    "x-access-token":
                                      cookies.get("Authorization"),
                                  },
                                }
                              );
                              if (res.status === 200) {
                                addToast("Item added to cart successfully", {
                                  appearance: "success",
                                });
                                window.location.reload();
                              } else {
                                console.log(res);
                              }
                            }}
                          >
                            Add To Cart
                          </button>
                        ) : (
                          <>
                            <p>Login before adding to cart</p>
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => {
                                history.push(pathname);
                                window.location.replace("/login-register");
                              }}
                            >
                              Login
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  {/* <div className="contact-social text-center">
                    <h3>Follow Us</h3>
                    <ul>
                      <li>
                        <a href="//facebook.com">
                          <i className="fa fa-facebook" />
                        </a>
                      </li>
                      <li>
                        <a href="//pinterest.com">
                          <i className="fa fa-pinterest-p" />
                        </a>
                      </li>
                      <li>
                        <a href="//thumblr.com">
                          <i className="fa fa-tumblr" />
                        </a>
                      </li>
                      <li>
                        <a href="//vimeo.com">
                          <i className="fa fa-vimeo" />
                        </a>
                      </li>
                      <li>
                        <a href="//twitter.com">
                          <i className="fa fa-twitter" />
                        </a>
                      </li>
                    </ul>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

Quote.propTypes = {
  location: PropTypes.object,
};

export default Quote;
