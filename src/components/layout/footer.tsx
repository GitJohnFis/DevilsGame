export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t p-4 mt-auto">
      <div className="container mx-auto text-center text-sm">
        <p className="font-body">
          © {new Date().getFullYear()} KNIGHTS TOUR de france. All rights reserved.
        </p>
        <p className="font-body text-xs mt-1">
          A legendary quest for glory on the checkered field!
        </p>
      </div>
    </footer>
  );
}
