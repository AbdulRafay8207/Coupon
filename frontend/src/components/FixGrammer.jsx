function FixGrammer(name = "") {
    return name.endsWith("s") ? `${name}'` : `${name}'s`
}
export default FixGrammer