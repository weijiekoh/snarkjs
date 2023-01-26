import * as utils from "./powersoftau_utils.js";
import * as binFileUtils from "./binfileutils.js";

export default async function exportHex(pTauFilename, verbose) {
    const {fd, sections} = await binFileUtils.readBinFile(pTauFilename, "ptau", 1);

    const {curve, power} = await utils.readPTauHeader(fd, sections);

    //const pTau = {};
    //pTau.q = curve.q;
    //pTau.power = power;
    //pTau.contributions = await utils.readContributions(fd, curve, sections);

    //pTau.tauG1 = await exportSection(2, "G1", (1 << power)*2 -1, "tauG1");
    //pTau.tauG2 = await exportSection(3, "G2", (1 << power), "tauG2");
    //pTau.alphaTauG1 = await exportSection(4, "G1", (1 << power), "alphaTauG1");
    //pTau.betaTauG1 = await exportSection(5, "G1", (1 << power), "betaTauG1");
    //pTau.betaG2 = await exportSection(6, "G2", 1, "betaG2");

    //pTau.lTauG1 = await exportLagrange(12, "G1", "lTauG1");
    //pTau.lTauG2 = await exportLagrange(13, "G2", "lTauG2");
    //pTau.lAlphaTauG1 = await exportLagrange(14, "G1", "lAlphaTauG2");
    //pTau.lBetaTauG1 = await exportLagrange(15, "G1", "lBetaTauG2");
    //
    //let g2 = curve.G2.g;
    //let g2_x0 = g2.slice(0, 32);
    //let g2_x1 = g2.slice(32, 64);
    //let g2_y0 = g2.slice(64, 96);
    //let g2_y1 = g2.slice(96, 128);
    //console.log(Buffer.from(curve.G2.F.fromMontgomery(g2_x0).slice(0, 32)).toString("hex"));
    //console.log(Buffer.from(curve.G2.F.fromMontgomery(g2_x1).slice(0, 32)).toString("hex"));
    //console.log(Buffer.from(curve.G2.F.fromMontgomery(g2_y0).slice(0, 32)).toString("hex"));
    //console.log(Buffer.from(curve.G2.F.fromMontgomery(g2_y1).slice(0, 32)).toString("hex"));

    let g1Points = await exportG1Section(2, "G1", (1 << power)*2 -1, (1 << power) + 1, "tauG1");
    let g2Points = await exportG2Section(3, "G2", (1 << power), (1 << power) + 1, "tauG2");
    await fd.close();

    return g1Points + "\n" + g2Points;

    async function exportG2Section(sectionId, groupName, nPoints, nPointsToWrite, sectionName) {
        const G = curve[groupName];
        const sG = G.F.n8*2;

        let res = "";
        await binFileUtils.startReadUniqueSection(fd, sections, sectionId);
        for (let i=0; i< nPoints; i++) {
            if ((verbose)&&i&&(i%10000 == 0)) console.log(`${sectionName}: ` + i);
            const buff = await fd.read(sG);

            let x0 = buff.slice(0, 32);
            let x1 = buff.slice(32, 64);
            let y0 = buff.slice(64, 96);
            let y1 = buff.slice(96, 128);
            let x0_hex = Buffer.from(curve.G2.F.fromMontgomery(x0).slice(0, 32)).toString("hex");
            let x1_hex = Buffer.from(curve.G2.F.fromMontgomery(x1).slice(0, 32)).toString("hex");
            let y0_hex = Buffer.from(curve.G2.F.fromMontgomery(y0).slice(0, 32)).toString("hex");
            let y1_hex = Buffer.from(curve.G2.F.fromMontgomery(y1).slice(0, 32)).toString("hex");
            if (i < nPointsToWrite) {
                res += x0_hex;
                res += x1_hex;
                res += y0_hex;
                res += y1_hex;
                res += "\n";
            }
        }
        await binFileUtils.endReadSection(fd);

        return res.trim();
    }

    async function exportG1Section(sectionId, groupName, nPoints, nPointsToWrite, sectionName) {
        const G = curve[groupName];
        const sG = G.F.n8*2;

        let res = "";
        await binFileUtils.startReadUniqueSection(fd, sections, sectionId);
        for (let i=0; i< nPoints; i++) {
            if ((verbose)&&i&&(i%10000 == 0)) console.log(`${sectionName}: ` + i);
            const buff = await fd.read(sG);
            const x_mont = buff.slice(0, 32);
            const y_mont = buff.slice(32);
            const x = G.F.fromMontgomery(x_mont);
            const y = G.F.fromMontgomery(y_mont);
            //const r = G.fromRprLEM(buff, 0);
            if (i < nPointsToWrite) {
                //res += Buffer.from(r).toString("hex") + "\n";
                res += Buffer.from(x).toString("hex");
                res += Buffer.from(y).toString("hex");
                res += "\n";
            }
        }
        await binFileUtils.endReadSection(fd);

        return res.trim();
    }
}
