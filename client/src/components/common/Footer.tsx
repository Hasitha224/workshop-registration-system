const Footer = () => {
    return (
        <div className="w-full text-gray-300 bg-primary shadow-sm flex flex-col justify-center items-center h-20 md:h-11 px-6 py-4 md:py-3 md:flex-row md:justify-between text-sm">
            <p>Workshop Registration System-{new Date().getFullYear()} | All Rights Reserved.</p>
            <div className="flex gap-1">
                <span className="cursor-pointer underline">Terms & Conditions </span>
                <span>| </span>
                <span className='cursor-pointer underline'>Privacy Policy</span>
            </div>
        </div>
    )
}

export default Footer