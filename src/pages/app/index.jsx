import React from "react";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import FallBackSuspense from "../../components/FallBackSuspense";
import NavBar from "../../Layout/NavBar";

const Training = lazy(() => import("./training/"));
const Tools = lazy(() => import("./tools"));
const Shop = lazy(() => import("./shop"));
const Entertainment = lazy(() => import("./entertainment"));
const Contact = lazy(() => import("./contact"));
const Home = lazy(() => import("./home"));

export default function App() {
  return (
    <div>
      <NavBar />
      <div>
        <Suspense fallback={<FallBackSuspense />}>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/tools" element={<Tools />}></Route>
            <Route path="/shop" element={<Shop />}></Route>
            <Route path="/entertainement" element={<Entertainment />}></Route>
            <Route path="/training" element={<Training />}></Route>
            <Route path="/contact" element={<Contact />}></Route>
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}