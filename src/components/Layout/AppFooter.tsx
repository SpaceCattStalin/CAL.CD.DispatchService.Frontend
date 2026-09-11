const AppFooter = () => {
    return (
        <div className='flex items-center justify-center h-full'>
            <span className='text-xs'>© {new Date().getFullYear()} Dispatch Service</span>
        </div>
    );
};

export default AppFooter;
