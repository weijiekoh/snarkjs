import * as fastFile from "fastfile";
import circomRuntime from "circom_runtime";
import * as wtnsUtils from "./wtns_utils.js";
import * as binFileUtils from "./binfileutils.js";

const { WitnessCalculatorBuilder } = circomRuntime;

export default async function wtnsCalculate(input, wasmFileName, wtnsFileName, options) {

    const startWasmRead = Date.now()
    const fdWasm = await fastFile.readExisting(wasmFileName);
    const wasm = await fdWasm.read(fdWasm.totalSize);
    await fdWasm.close();
    const endWasmRead = Date.now()
    console.log("\twasm read duration:", (endWasmRead - startWasmRead) / 1000);

    const startWCBuilder = Date.now()
    const wc = await WitnessCalculatorBuilder(wasm);
    const endWCBuilder = Date.now()
    console.log("\tWitnessCalculatorBuilder duration:", (endWCBuilder - startWCBuilder) / 1000);

    const startCalc = Date.now()
    const w = await wc.calculateBinWitness(input);
    const endCalc = Date.now()
    console.log("\tcalculateBinWitness duration:", (endCalc - startCalc) / 1000);

    const startWrite = Date.now()
    const fdWtns = await binFileUtils.createBinFile(wtnsFileName, "wtns", 2, 2);

    await wtnsUtils.writeBin(fdWtns, w, wc.prime);
    await fdWtns.close();
    const endWrite = Date.now()
    console.log("\twitness write duration:", (endWrite - startWrite) / 1000);

}
