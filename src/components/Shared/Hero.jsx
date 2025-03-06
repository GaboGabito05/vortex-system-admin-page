function Hero({ span, title, description }) {
    return (
        <section className="hero products-hero">
            <div className="container">
                <div className="hero-content text-center">
                    <span className="badge">{span}</span>
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>
            </div>
        </section>
    )
}

export default Hero;